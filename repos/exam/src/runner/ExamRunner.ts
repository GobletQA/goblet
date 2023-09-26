
import type {
  TExRunnerCfg,
  IExamRunner,
  IExamEnvironment,
  TExFileModel,
  TStateObj,
  TExamEvt,
  TExEventData,
} from '@GEX/types'

import { Logger } from '@GEX/utils/logger'
import { RootSuiteId } from '@GEX/constants'
import { Errors } from '@GEX/constants/errors'
import { ExamEvents } from '@GEX/events/Events'
import { exists } from '@keg-hub/jsutils/exists'
import { uniqArr } from '@keg-hub/jsutils/uniqArr'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { ReportEventMapper } from '@GEX/reporter/ReportEventMapper'

export type TRunnerBindEvts = {
  result?:Partial<TExEventData> & Record<string, any>
  methods?:Array<
    | `onRunDone`
    | `onRunStart`
    | `onSpecDone`
    | `onSpecStart`
    | `onSuiteDone`
    | `onSuiteStart`
    | string
  >
  [key:string]:any
}


/**
 * Runner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
export class ExamRunner<E extends IExamEnvironment> implements IExamRunner<E> {

  debug?:boolean
  verbose?:boolean
  reuseRunner:boolean

  bail:number=0
  testRetry:number=0
  suiteRetry:number=0
  
  testTimeout?:number
  suiteTimeout?:number
  exitOnFailed:boolean=false
  skipAfterFailed:boolean=true
  
  environment:E
  canceled?:boolean
  isRunning?:boolean
  omitTestResults:string[] = []
  eventReporter:ReportEventMapper

  bindMethods:string[]=[
    `onRunDone`,
    `onRunStart`,
    `onSpecDone`,
    `onSpecStart`,
    `onSuiteDone`,
    `onSuiteStart`,
  ]

  constructor(cfg:TExRunnerCfg, state:TStateObj) {
    const {
      EventReporter,
      BaseEnvironment
    } = state

    this.isRunning = false
    this.eventReporter = EventReporter
    this.environment = BaseEnvironment as E

    if(cfg?.debug) this.debug = cfg.debug
    if(cfg?.verbose) this.verbose = cfg.verbose
    if(cfg?.reuseRunner) this.reuseRunner = cfg.reuseRunner

    if(cfg?.bail) this.bail = cfg.bail
    if(cfg?.testRetry) this.testRetry = cfg.testRetry
    if(cfg?.suiteRetry) this.suiteRetry = cfg.suiteRetry

    if(cfg?.testTimeout) this.testTimeout = cfg.testTimeout
    if(cfg?.suiteTimeout) this.suiteTimeout = cfg.suiteTimeout
    if(cfg?.exitOnFailed) this.exitOnFailed = cfg.exitOnFailed

    if(cfg?.omitTestResults?.length)
      this.omitTestResults = [...this.omitTestResults, ...cfg.omitTestResults]

    if(exists(cfg?.skipAfterFailed)) this.skipAfterFailed = cfg.skipAfterFailed


  }

  /**
  * Helper method to bind data to test events fired from test execution
  * Not required, but this helper makes it easier to manage
  */
  protected bindEvents = (args:TRunnerBindEvts, ...rest:any[]) => {
    const methods = uniqArr([...this.bindMethods, ...(args?.methods || emptyArr)])
    if(!methods?.length) return emptyObj

    return (methods.reduce((acc, cb) => {
      acc[cb] = (result:TExEventData) => this?.[cb]?.call?.(
        this,
        {...result, ...args.result},
        ...rest
      )

      return acc
    }, {}))
  }

  /**
   * Calls the EventReporter instance
   * Which then calls the callback methods of all registered reporters
   * callback method is based on the `event.name` field
   */
  event = async (evt:TExamEvt) => this.eventReporter.event(evt)

  /**
  * Helper method to clean the tests results object of un-used properties
  * Not required but means if does not have to be rewritten in every runner
  */
  cleanExResult = (result:TExEventData, omitProps:string[]=emptyArr) => {
    return omitKeys<TExEventData>(result, [...this.omitTestResults, ...omitProps])
  }

  /**
   * Helper method that's not really needed
   * Here for backwards compat
   */
  onIsRunning = () => {
    return this.isRunning
  }


  /**
   * This method is expected to be overwritten by a child class
   * But does not throw because it may not be needed
   */
  cancel = (...args:any[]) => {
    this.canceled = true
  }

  /**
   * Default cleanup method for cleaning up the runner after a test run
   * Don't throw because it may have been called during an abort
   * Due to how abort works, it may cause an error that is not important
   */
  cleanup = async () => {
    try {
      this.isRunning = false
      this.environment?.cleanup?.()
    }
    catch(err){
      Logger.error(`[Runner Error] Runner.cleanup threw the following error`)
      Logger.log(err.stack)
      Logger.empty()
    }
  }

  /**
   * This method is expected to be overwritten by a child class
   * Which is why it throws by default
   */
  run = (model:TExFileModel, state:TStateObj) => {
    Errors.Override(`ExamRunner.run`)
    return undefined
  }


  /**
   * ---------- Test Callback Methods Below ---------- *
   *
   * The following methods are default handlers for Test Runner callbacks
   * Child classes should override them if custom functionality is needed
   * Or if a custom test executor is being used
   *
   */


  /**
   * Callback when a the runner starts a test suite
   */
  onRunStart = (result:TExEventData, ...args:any[]) => {
    this.event(ExamEvents.started({ data: this.cleanExResult(result) }))
  }

  onRunDone = (result:TExEventData) => {
    this.event(ExamEvents.results({ data: result }))
  }

  /**
   * Callback when a spec completes
   * Has default handling for failed tests
   * Override if custom failed test handling is needed
   */
  onSpecDone = async (result:TExEventData, ...args:any[]) => {
    if(this.canceled) return

    await this.event(ExamEvents.specDone({
      data: {
        ...this.cleanExResult(result),
        failedExpectations: result?.failedExpectations
      }
    }))
  }

  /**
   * Callback when a spec starts
   */
  onSpecStart = (result:TExEventData, ...args:any[]) => {
    if(this.canceled) return

    this.event(ExamEvents.specStart({
      data: this.cleanExResult(result),
    }))
  }

  /**
   * Callback when a suite starts
   */
  onSuiteStart = (result:TExEventData, ...args:any[]) => {
    if(this.canceled) return

    const data = this.cleanExResult(result)
    result.id === RootSuiteId
      ? this.event(ExamEvents.suiteStartRoot({ data }))
      : this.event(ExamEvents.suiteStart({ data }))
  }

  /**
   * Callback when a suite is done
   * Adds default handling for the root suite vs child suite
   * I.E. root describe vs child describe
   * @example
   * describe(`root describe`, () => {
   *  describe(`child describe`, () => {})
   * })
   *
   */
  onSuiteDone = (result:TExEventData, ...args:any[]) => {
    if(this.canceled) return

    const data = this.cleanExResult(result)
    result.id === RootSuiteId
      ? this.event(ExamEvents.suiteDoneRoot({ data }))
      : this.event(ExamEvents.suiteDone({ data }))
  }

}
