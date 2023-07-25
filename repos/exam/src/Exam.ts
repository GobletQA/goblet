import type {
  TExRun,
  TExData,
  TExamEvt,
  TExamRun,
  TExamConfig,
  TExamRunOpts,
  TExFileModel,
  TExEventData,
  TExamEventCB,
  TExamCancelCB,
  TExamCleanupCB,
} from '@GEX/types'

import { Loader } from '@GEX/Loader'
import { Execute } from '@GEX/Execute'
import { EExTestMode, EExErrorType } from '@GEX/types'
import { buildExamCfg } from '@GEX/utils/buildExamCfg'
import { buildExecCfg } from '@GEX/utils/buildExecCfg'
import { buildResultFailed } from '@GEX/utils/buildResult'
import { ExamEvents, addCustomEvents } from '@GEX/Events'
import { exists, checkCall, flatArr, isObj } from '@keg-hub/jsutils'
import { Errors, ExamEvtNames, NoTestsFoundPass } from '@GEX/constants'

/**
 * @type Exam
 */
export class Exam {

  // Cache the config, so we can init executor lazily
  #config:TExamConfig

  loader:Loader
  bail?:number=0
  execute:Execute
  id:string = null
  mode:EExTestMode
  canceled:boolean=false
  onEvents:TExamEventCB[] = []
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
  passWithNoTests:boolean=false

  static isRunning:boolean = false

  constructor(cfg:TExamConfig, id:string) {
    this.id = id
    const config = buildExamCfg(cfg)

    this.loader = new Loader(this, config)
    this.#config = config
    this.#setEvents(config)

    this.mode = config.mode || EExTestMode.serial

    if(config.bail) this.bail = config.bail

    if(exists(config.passWithNoTests))
      this.passWithNoTests = config.passWithNoTests
  }

  #setEvents = (config:Pick<TExamConfig, `onEvent`|`onCancel`|`onCleanup`|`events`>) => {
    const {
      events,
      onEvent,
      onCancel,
      onCleanup,
    } = config

    if(onEvent) this.onEvents.push(onEvent)
    if(onCancel) this.onCancel = onCancel
    if(onCleanup) this.onCleanup = onCleanup

    events && addCustomEvents(events)
  }

  #runTest = async <T extends TExData=TExData>(options:TExamRun<T>) => {
    const { file } = options
    const model = isObj<TExFileModel>(file)
      ? file
      : this.loader.loadContent<TExFileModel<T>>(file, { testFile: true, asModel: true })

    const results = await this.execute.exec<T>({...options, file: model })

    !this.canceled
      && this.event(ExamEvents.results({ data: results }))

    return results
  }

  #runTests = async <T extends TExData=TExData>(opts:TExamRunOpts<T>) => {
    const {
      testDir,
      rootDir,
      testMatch,
      testIgnore,
      ...rest
    } = opts

    const tests = await this.loader.loadTests(testMatch, {
      testDir,
      rootDir,
      testIgnore,
    })

    if(!tests){
      if(this.passWithNoTests) return [NoTestsFoundPass]
      Errors.NoTests(testMatch)
      return undefined
    }

    /**
     * A placeholder to keep tracked of filed tests
     * Compare against `this.bail`, and stop tests if `this.bail` is active
     */
    let bail = 0

    /**
     * Check `mode` here, and run the tests based on it
     * Will probably need to add a queue, or add chunking to the tests
     * Otherwise will try to run all tests at the same time
     * Need to add different loop types for `serial` and `parallel`
     */
    if(this.mode === EExTestMode.parallel){
      const resp = await Promise.all(
        Object.entries(tests)
          .map(([loc, file]) => {
            try {
              return this.#runTest<T>({ file, ...rest } as TExamRun<T>)
            }
            catch(err){
              bail += 1
              if(this.bail && (bail >= this.bail)){
                Errors.BailedTests(this.bail, `Exam.run`, err)
                return
              }

              const fromRoot = loc.replace(this.loader.rootDir, ``)

              return err.type === EExErrorType.TestErr
                ? err.result
                : buildResultFailed({
                    id: fromRoot,
                    testPath: fromRoot,
                    fullName: file.name,
                    description: err.message,
                  })

            }
          })
      )

      return flatArr<TExEventData>(resp)
    }

    return await Object.entries(tests)
      .reduce(async (acc, [loc, file]) => {
        const arr = await acc
        try {

          const resp = await this.#runTest<T>({file, ...rest} as TExamRun<T>)
          arr.push(...resp)

          return arr
        }
        catch(err){
          bail += 1
          if(this.bail && (bail >= this.bail)){
            Errors.BailedTests(this.bail, `Exam.run`, err)
            return
          }

          const fromRoot = loc.replace(this.loader.rootDir, ``)

          err.type === EExErrorType.TestErr
            ? arr.push(err.result)
            : arr.push(buildResultFailed({
                id: fromRoot,
                testPath: fromRoot,
                fullName: file.name,
                description: err.message,
              }))

          return arr
        }
      }, Promise.resolve([] as TExEventData[]))
  }

  /**
   * Loops the registered event methods and calls each one passing in the event object
   * Ensures the current recording state is added and upto date
   * @member {Exam}
   */
  event = (evt:TExamEvt) => {
    if(this.canceled) return this

    this.onEvents.map(func => checkCall(func, {
      ...evt,
      isRunning: Exam.isRunning,
    }))

    return this
  }

  /**
   * Initializes the Executor
   * This is done lazily due to it being async
   * @member {Exam}
   */
  initExec = async (force?:boolean) => {
    if(this.execute){
      if(!force) return this.execute
      await this.execute.cleanup()
      this.execute = undefined
    }

    const execCfg = await buildExecCfg({
      exam: this,
      config: this.#config,
    })
    this.execute = new Execute(execCfg)
  }

  /**
   * Starts recording dom events by injecting scripts browser context
   * @member {Exam}
   */
  run = async <T extends TExData=TExData>(opts:TExamRunOpts<T>) => {

    let resp:TExEventData[]
    let error:Error
    try {
  
      await this.initExec()
  
      if(Exam.isRunning){
        this.event(ExamEvents.alreadyPlaying)
        return undefined
      }

      Exam.isRunning = true
      this.#setEvents(opts)
      
      const {
        file,
        testDir,
        rootDir,
        testMatch,
        testIgnore,
        ...rest
      } = opts

      // TODO: handle reporters here

      resp = file
        ? await this.#runTest<T>({file, ...rest} as TExamRun<T>)
        : await this.#runTests<T>(opts)

    }
    catch(err){
      if(!this.canceled){
        error = err
        this.event(
          ExamEvents.dynamic({
            message: err.message,
            name: ExamEvtNames.error,
          })
        )
      }

    }
    finally {

      if(!this.canceled){
        await this.stop()
        if(error) throw error
      }

      return resp
    }

  }

  /**
   * Stops recording dom events by removing the current page and creating a new one
   * @member {Exam}
   */
  stop = async () => {
    let error:Error
    try {
      if(!Exam.isRunning)
        return this.event(ExamEvents.stopped)

      Exam.isRunning = false
      this.event(ExamEvents.ended)
    }
    catch(err){
      error = err

      this.event(
        ExamEvents.dynamic({
          message: err.message,
          name: ExamEvtNames.error,
        })
      )
    }
    finally {
      await this.cleanup()
      error && Errors.Stop(`Exam.stop`, error)
    }

    return this
  }

  cancel = async () => {
    this.event(ExamEvents.canceled)

    await this.execute?.cancel?.()
    this.canceled = true

    try {
      await this?.onCancel?.(this)
    }
    catch(err){
      console.error(err)
      this.event(ExamEvents.dynamic({
        message: err.message,
        name: ExamEvtNames.error,
      }))
    }
    
    await this.stop()

    return this
  }

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanup = async () => {
    try {
      await this.onCleanup?.(this)
    }
    catch(err){
      console.error(err)
      this.event(ExamEvents.dynamic({
        message: err.message,
        name: ExamEvtNames.error,
      }))
    }
    finally {
      this?.loader?.cleanup?.()
      await this?.execute?.cleanup?.()
    }

    this.onEvents = []
    this.loader = undefined
    this.execute = undefined
    this.onCancel = undefined
    this.onCleanup = undefined
    
    Exam.isRunning = false
  }
}