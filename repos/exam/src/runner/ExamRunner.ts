import type { Exam } from '@GEX/Exam'
import type { IExRunner } from '@GEX/types'

import { Errors } from '@GEX/constants/errors'

export type TRunnerOpts = {
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?:number
  [key:string]: any
}

/**
 * Runner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
export class ExamRunner implements IExRunner {

  exam:Exam
  exec = undefined
  canceled:boolean
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?: number

  constructor(exam:Exam, opts?:TRunnerOpts) {
    this.exam = exam

    if(opts?.debug) this.debug = opts.debug
    if(opts?.slowMo) this.slowMo = opts.slowMo
    if(opts?.timeout) this.timeout = opts.timeout
    if(opts?.globalTimeout) this.globalTimeout = opts.globalTimeout
  }
  
  run = (...args:any[]) => {
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
