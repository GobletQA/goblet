import type { Exam } from '@GEX/Exam'
import type {
  TExCtx,
  TExData,
  IExRunner,
  TExRunnerCfg,
  TTransformResp,
  IExEnvironment,
  IExamRunner,
  IExamEnvironment,
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'
import {ExamEnvironment} from '@GEX/environment'


/**
 * Runner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
export class ExamRunner<E extends IExamEnvironment> implements IExamRunner<E> {

  exam:Exam
  failed:number=0
  debug?:boolean
  timeout?:number
  verbose?:boolean
  canceled?:boolean
  isRunning?:boolean
  globalTimeout?:number
  environment:E


  constructor(cfg:TExRunnerCfg, ctx:TExCtx) {
    const { exam, environment } = ctx

    this.exam = exam
    this.environment = environment

    this.isRunning = false

    if(cfg?.debug) this.debug = cfg.debug
    if(cfg?.timeout) this.timeout = cfg.timeout
    if(cfg?.verbose) this.verbose = cfg.verbose
    if(cfg?.globalTimeout) this.globalTimeout = cfg.globalTimeout

  }

  /**
   * Method used to load tests into the environment
   */
  protected load = (ctx:TExCtx) => {
    const { file } = ctx
    return this.exam.loader.runTest(file)
  }

  /**
   * Called when a page loads to check if mouse tracker should run
   * Is called from within the browser context
   */
  onIsRunning = () => {
    return this.isRunning
  }

  run = (content:TTransformResp, ctx:TExCtx) => {
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
