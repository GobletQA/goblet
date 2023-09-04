
import type {
  TExRunnerCfg,
  IExamRunner,
  IExamEnvironment,
  TExFileModel,
  TStateObj,
  TExamEvt,
} from '@GEX/types'

import {exists} from '@keg-hub/jsutils/exists'
import { Errors } from '@GEX/constants/errors'
import {ReportEventMapper} from '@GEX/reporter/ReportEventMapper'


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
  eventReporter:ReportEventMapper


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
    if(exists(cfg?.skipAfterFailed)) this.skipAfterFailed = cfg.skipAfterFailed


  }

  event = async (evt:TExamEvt) => this.eventReporter.event(evt)

  /**
   * Called when a page loads to check if mouse tracker should run
   * Is called from within the browser context
   */
  onIsRunning = () => {
    return this.isRunning
  }

  run = (model:TExFileModel, state:TStateObj) => {
    Errors.Override(`ExamRunner.run`)
    return undefined
  }

  cancel = (...args:any[]) => {
    Errors.Override(`ExamRunner.cancel`)
    return undefined
  }

  cleanup = () => {
    Errors.Override(`ExamRunner.cleanup`)
    return undefined
  }

  onSpecStarted = (...args:any[]) => {
    return undefined
  }

  onSpecDone = (...args:any[]) => {
    return undefined
  }

  onSuiteStarted = (...args:any[]) => {
    return undefined
  }

  onSuiteDone = (...args:any[]) => {
    return undefined
  }
}
