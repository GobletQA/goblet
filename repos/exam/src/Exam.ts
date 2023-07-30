import {
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
  EPlayerTestType,
  EPlayerTestAction,
} from '@GEX/types'

import { Loader } from '@GEX/Loader'
import { Execute } from '@GEX/Execute'
import {Logger} from '@GEX/utils/logger'
import { Errors, ExamEvtNames } from '@GEX/constants'
import { EExTestMode, EExErrorType } from '@GEX/types'
import { buildExamCfg } from '@GEX/utils/buildExamCfg'
import { buildExecCfg } from '@GEX/utils/buildExecCfg'
import { buildReporters } from './utils/buildReporters'
import { ExamEvents, addCustomEvents } from '@GEX/Events'
import { ReportEventMapper } from '@GEX/reporter/ReportEventMapper'
import { exists, checkCall, flatArr, isObj, emptyObj, isBool, isNum } from '@keg-hub/jsutils'
import {
  buildNoTestsResult,
  buildFailedTestResult,
} from '@GEX/utils/buildResult'


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
  bail?:number=0
  canceled:boolean=false
  onCancel?:TExamCancelCB
  onCleanup?:TExamCleanupCB
  onEvents:TExamEventCB[] = []
  passWithNoTests:boolean=false
  eventReporter:ReportEventMapper

  static isRunning:boolean = false

  constructor(cfg:TExamConfig, id:string) {

    this.id = id
    const config = buildExamCfg(cfg)
    this.loader = new Loader(this, config)
    this.#config = config
    this.#setEvents(config)

    this.mode = config.mode || EExTestMode.serial

    isBool(config.bail)
      ? config.bail && (this.bail = 1)
      : isNum(config.bail) && (this.bail = config.bail)

    if(exists(config.passWithNoTests))
      this.passWithNoTests = config.passWithNoTests

  }

  #onNoTests = (testMatch:string|string[]) => {
    if(this.passWithNoTests) return [buildNoTestsResult()]
    Errors.NoTests(testMatch)
    return undefined
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

  /**
   * Runs a single test file base on a passed in file model or string path
   */
  #runTest = async <T extends TExData=TExData>(options:TExamRun<T>) => {
    const { file, single } = options
    const model = isObj<TExFileModel>(file)
      ? file
      : await this.loader.loadContent<TExFileModel<T>>(file, { single, testFile: true, asModel: true })

    if(!model){
      if(single)
        return this.#onNoTests(isObj(file) ? file.location : file)
    }

    const results = await this.execute.exec<T>({...options, file: model })

    !this.canceled
      && this.event(ExamEvents.results({
          data: results,
          location: model.location.replace(this.loader.rootDir, ``)
        }))

    return results
  }

  /**
   * Runs multiple test files base on passed in options
   */
  #runTests = async <T extends TExData=TExData>(opts:TExamRunOpts<T>=emptyObj) => {
    const {
      cli,
      testDir,
      rootDir,
      testMatch,
      testIgnore,
      ...rest
    } = opts

    // If called from the CLI, the tests should have already been found
    const tests = cli
      ? testMatch
      : await this.loader.loadTests(testMatch, {
          testDir,
          rootDir,
          testIgnore,
        })

    if(!tests) return this.#onNoTests(testMatch)


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
              const fromRoot = loc.replace(this.loader.rootDir, ``)

              return [EExErrorType.TestErr, EExErrorType.BailError].includes(err.name)
                ? err.result
                : buildFailedTestResult({
                  id: fromRoot,
                  testPath: fromRoot,
                  fullName: file.name,
                  description: err.message,
                  type: EPlayerTestType.error,
                  action: EPlayerTestAction.error,
                  timestamp: new Date().getTime(),
                  failedExpectations: [{
                    description: err.stack,
                    fullName: `${err.name}${exists(err.code) ? `- ${err.code}` : ``}`,
                  }]
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
          const fromRoot = loc.replace(this.loader.rootDir, ``)
          
          ;[EExErrorType.TestErr, EExErrorType.BailError].includes(err.name)
            ? arr.push(err.result)
            : arr.push(buildFailedTestResult({
                id: fromRoot,
                testPath: fromRoot,
                fullName: file.name,
                description: err.message,
                type: EPlayerTestType.error,
                action: EPlayerTestAction.error,
                timestamp: new Date().getTime(),
                failedExpectations: [{
                  description: err.stack,
                  fullName: `${err.name}${exists(err.code) ? `- ${err.code}` : ``}`,
                }]
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

    const event = {...evt, isRunning: Exam.isRunning}

    this?.eventReporter?.event?.(event)
    this.onEvents.map(func => checkCall(func, event))

    return this
  }

  initReporters = async (force?:boolean) => {
    this.eventReporter = this.eventReporter || new ReportEventMapper()

    if(this.eventReporter.reporters){
      if(!force) return this.eventReporter.reporters
      await Promise.all(this.eventReporter.reporters.map(async (rpt) => await rpt?.cleanup?.()))
      this.eventReporter.reporters = undefined
    }
    
    this.eventReporter.reporters = await buildReporters({
      exam: this,
      config: this.#config,
      reporters: this.#config.reporters
    })
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
  run = async <T extends TExData=TExData>(opts:TExamRunOpts<T>=emptyObj) => {

    let resp:TExEventData[]
    let error:Error & { result?:TExEventData }
    try {

      if(Exam.isRunning){
        this.event(ExamEvents.alreadyPlaying)
        return undefined
      }

      Exam.isRunning = true
      this.#setEvents(opts)

      !this.execute
        && await this.initExec()

      !this.eventReporter
        && await this.initReporters()

      const {
        file,
        testDir,
        rootDir,
        testMatch,
        testIgnore,
        ...rest
      } = opts

      resp = file
        ? await this.#runTest<T>({file, ...rest, single: true } as TExamRun<T>)
        : await this.#runTests<T>(opts)

    }
    catch(err){
      if(!this.canceled){
        error = err
        const errorData = `${err.name}${exists(err.code) ? `- ${err.code}` : ``}`
        this.event(
          ExamEvents.dynamic({
            message: err.message,
            name: ExamEvtNames.error,
            data: {
              id: this.id,
              testPath: errorData,
              fullName: err.name,
              description: err.message,
              type: EPlayerTestType.error,
              action: EPlayerTestAction.error,
              timestamp: new Date().getTime(),
              failedExpectations: [{
                fullName: errorData,
                description: err.stack,
              }]
            }
          })
        )
      }

    }
    finally {
      if(!this.canceled){
        await this.stop()

        if(error){
          if(error.result) return [error.result]

          throw error
        }
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
    this.eventReporter = undefined
    
    Exam.isRunning = false
  }
}