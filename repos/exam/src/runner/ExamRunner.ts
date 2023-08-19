
import type {
  TExRunnerCfg,
  IExamRunner,
  IExamEnvironment,
  TExFileModel,
  TStateObj,
  TExamEvt,
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'
import {ReportEventMapper} from '@GEX/reporter/ReportEventMapper'


/**
 * Runner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
export class ExamRunner<E extends IExamEnvironment> implements IExamRunner<E> {

  failed:number=0
  debug?:boolean
  timeout?:number
  verbose?:boolean
  canceled?:boolean
  isRunning?:boolean
  globalTimeout?:number
  environment:E
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
    if(cfg?.timeout) this.timeout = cfg.timeout
    if(cfg?.verbose) this.verbose = cfg.verbose
    if(cfg?.globalTimeout) this.globalTimeout = cfg.globalTimeout

  }

  event = (evt:TExamEvt) => this.eventReporter.event(evt)

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
