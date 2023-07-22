import type { Exam, TExecCtx } from "@gobletqa/exam"
import {
  RunnerErr,
  ExamRunner,
  ExamEvents,
} from "@gobletqa/exam"

import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'
import type { TPlayerEventData, TPlayerTestEvent } from '@gobletqa/shared/types'

import { Parkin } from '@ltipton/parkin'
import { ParkinTest } from '@ltipton/parkin/test'
import { emptyObj, omitKeys } from '@keg-hub/jsutils'
import { FeatureEnvironment } from './FeatureEnvironment'

type RunContent = string | string[] | TFeatureAst | TFeatureAst[]

type TFeatureData = {
  steps?:TParkinRunStepOptsMap
}

export type TRunnerOpts = {
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?:number
}

/**
 * Runner
 * Sets up the test environment to allow running tests in a secure context
 * Ensures the test methods exist on the global scope
 */
export class FeatureRunner extends ExamRunner {

  /**
   * Player Class instance
   */
  PK:Parkin
  PTE:ParkinTest
  isRunning?:boolean

  environment:FeatureEnvironment

  omitTestResults:string[] = [
    `tests`,
    `describes`,
    `passedExpectations`,
    `failedExpectations`,
  ]

  constructor(exam:Exam, opts?:TRunnerOpts) {
    super(exam, opts)

    this.isRunning = false
    this.environment = new FeatureEnvironment()
  }


  /**
   * Called when a page loads to check if mouse tracker should run
   * Is called from within the browser context
   */
  onIsRunning = () => {
    return this.isRunning
  }


  /**
   * Runs the code passed to it via the exam
   */
  run = async (content:RunContent, ctx:TExecCtx<TFeatureData>) => {
    
    const steps = ctx?.data?.steps
    
    this.PTE = this.environment.setupGlobals(this)
    this.PK = await this.environment.setupParkin(this)

    // Timeout gets passed as last argument to test() method of global test method 
    await this.PK.run(content, {
      tags: {},
      steps: steps,
      timeout: this.timeout,
    })

    const results = await this.PTE.run() as TPlayerEventData[]

    // We only support 1 feature per file, so we only care about the first test result 
    const final = this.clearTestResults(results[0])
    await this.cleanup()

    return this.canceled ? emptyObj as TPlayerEventData : final
  }

  onSpecDone = (result:TPlayerEventData) => {

    if(this.canceled) return

    this.exam.fireEvent(ExamEvents.specDone({
      data: {
        ...this.clearTestResults(result),
        failedExpectations: result?.failedExpectations
      }
    })
    )

    if(result.failed){
      this.cancel()
      throw new RunnerErr(result?.failedExpectations?.[0]?.description || `Spec Failed`)
    }
  }

  onSuiteDone = (result:TPlayerEventData) => {
    this.environment.cleanup(this)
    if(this.canceled) return

    this.exam.fireEvent(ExamEvents.suiteDone({
      data: this.clearTestResults(result)
    }))
  }

  onSpecStarted = (result:TPlayerEventData) => {
    if(this.canceled) return

    this.exam.fireEvent(ExamEvents.specStart({
      data: this.clearTestResults(result),
    }))
  }

  onSuiteStarted = (result:TPlayerEventData) => {
    if(this.canceled) return

    this.exam.fireEvent(ExamEvents.specStart({
      data: this.clearTestResults(result),
    }))
  }

  cancel = async () => {
    this.canceled = true
    this.PTE?.abort?.()
    this?.PK?.runner?.steps?.clear()
    this?.PK?.steps?.clear()

    await this.cleanup?.()
  }

  cleanup = async () => {
    this.environment.cleanup(this)
    this.environment.resetGlobals()
    this?.PTE?.clean()

    this.exam = undefined
    this.PK = undefined
    this.PTE = undefined
  }

  /**
  * There's a lot of meta-data that is added to the player tests results object
  * This clears out some of it, because the frontend does not need it
  */
  clearTestResults = (result:TPlayerTestEvent|TPlayerEventData) => {
    return omitKeys<TPlayerTestEvent>(
      result,
      this.omitTestResults
    )
  }


}
