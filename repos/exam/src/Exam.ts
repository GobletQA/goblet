import type {
  TExRun,
  TExData,
  TExamEvt,
  TExamRun,
  TExamConfig,
  TExamRunOpts,
  TExamEventCB,
  TExamCancelCB,
  TExamCleanupCB,
  TExFileModel,
  TExEventData,
} from '@GEX/types'

import { Loader } from '@GEX/Loader'
import { Execute } from '@GEX/Execute'
import { EExTestMode } from '@GEX/types'
import { checkCall, flatArr, isObj } from '@keg-hub/jsutils'
import { Errors, ExamEvtNames } from '@GEX/constants'
import { buildExamCfg } from '@GEX/utils/buildExamCfg'
import { buildExecCfg } from '@GEX/utils/buildExecCfg'
import { ExamEvents, addCustomEvents } from '@GEX/Events'

/**
 * @type Exam
 */
export class Exam {

  // Cache the config, so we can init executor lazily
  #config:TExamConfig

  loader:Loader
  execute:Execute
  id:string = null
  mode:EExTestMode
  canceled:boolean=false
  onEvents:TExamEventCB[] = []
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB

  static isRunning:boolean = false

  constructor(cfg:TExamConfig, id:string) {
    this.id = id
    const config = buildExamCfg(cfg)

    this.loader = new Loader(this, config)
    this.#config = config
    this.#setEvents(config)
    this.mode = config.mode || EExTestMode.serial
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

    /**
     * Check `mode` here, and run the tests based on it
     * Will probably need to add a queue, or add chunking to the tests
     * Otherwise will try to run all tests at the same time
     * Need to add different loop types for `serial` and `parallel`
     */
    if(this.mode === EExTestMode.parallel){
      const resp = await Promise.all(
        Object.entries(tests)
          .map(([loc, file]) => this.#runTest<T>({ file, ...rest } as TExamRun<T>))
      )

      return flatArr<TExEventData>(resp)
    }

    else
      return await Object.entries(tests)
        .reduce(async (acc, [key, file]) => {
          const arr = await acc
          const resp = await this.#runTest<T>({ file, ...rest } as TExamRun<T>)
          arr.push(...resp)
          
          return arr
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
        return this
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

      !this.canceled && await this.stop()

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
      await this.cleanUp()
      error && Errors.Stop(`Exam.stop`, error)
    }

    return this
  }

  cancel = async () => {
    this.event(ExamEvents.canceled)

    // TODO: Fix this once runners are setup
    await this.execute?.cancel?.()

    this.canceled = true
    await this.stop()

    return this
  }

  /**
   * Helper method to clean up when recording is stopped
   * Attempts to avoid memory leaks by un setting Recorder instance properties
   */
  cleanUp = async () => {
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

    this.onEvents = []
    Exam.isRunning = false
  }
}