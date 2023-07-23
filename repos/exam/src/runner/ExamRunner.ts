import type { Exam } from '@GEX/Exam'
import type {
  TExCtx,
  TExData,
  IExRunner,
  TExRunnerOpts,
  TTransformResp
} from '@GEX/types'

import { Errors } from '@GEX/constants/errors'

/**
 * Runner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
export class ExamRunner<
  T extends TExData=TExData,
  R=unknown
> implements IExRunner {

  exam:Exam
  canceled:boolean
  debug?: boolean
  slowMo?: number
  timeout?: number
  isRunning?:boolean
  globalTimeout?: number

  constructor(ctx:TExCtx<T>) {
    const { exam } = ctx

    this.exam = exam
    this.isRunning = false

    if(ctx?.debug) this.debug = ctx.debug
    if(ctx?.slowMo) this.slowMo = ctx.slowMo
    if(ctx?.timeout) this.timeout = ctx.timeout
    if(ctx?.globalTimeout) this.globalTimeout = ctx.globalTimeout
  }

  /**
   * Called when a page loads to check if mouse tracker should run
   * Is called from within the browser context
   */
  onIsRunning = () => {
    return this.isRunning
  }


  run = (content:TTransformResp<R>, ctx:TExCtx<T>) => {
    Errors.Override(`ExamRunner.run`)
    return undefined
  }

  cancel = (...args:any[]) => {
    Errors.Override(`ExamRunner.cancel`)
    return undefined
  }

  cleanup = (...args:any[]) => {
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
