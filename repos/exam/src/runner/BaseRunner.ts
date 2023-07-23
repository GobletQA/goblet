import type {
  TExCtx,
  TExEventData,
  TExTestEvent,
} from '@GEX/types'

import { ExamEvents } from '@GEX/Events'
import { ExamRunner } from './ExamRunner'
import {RunnerErr} from '@GEX/utils/error'
import { ParkinTest } from '@ltipton/parkin/test'
import {emptyObj, omitKeys} from '@keg-hub/jsutils'
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'

export type TRunContent = Record<string, any>

export class BaseRunner extends ExamRunner {

  PTE:ParkinTest
  environment:BaseEnvironment
  omitTestResults:string[] = [
    `tests`,
    `describes`,
    `passedExpectations`,
    `failedExpectations`,
  ]

  constructor(ctx:TExCtx) {
    super(ctx)

    this.isRunning = false
    this.environment = ctx.environment as BaseEnvironment
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
  run = async (content:TRunContent, ctx:TExCtx) => {
    this.PTE = this.environment.setupGlobals(this, ctx)
    
    // TODO: execute the file here - VM?
    //  - This is call all the describes / test methods within the file
    //  - The file content only exists as a string / AST
    //  - So we need to eval it in some way that's safe?
    // Then call PTE.run to actually run the tests

    const results = await this.PTE.run() as TExEventData[]

    // We only support 1 feature per file, so we only care about the first test result 
    const final = this.clearTestResults(results[0])
    await this.cleanup()

    return this.canceled ? emptyObj as TExEventData : final
  }

  onSpecDone = (result:TExEventData) => {
    if(this.canceled) return

    this.exam.event(ExamEvents.specDone({
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

  onSuiteDone = (result:TExEventData) => {
    this.environment.cleanup(this)
    if(this.canceled) return

    this.exam.event(ExamEvents.suiteDone({
      data: this.clearTestResults(result)
    }))
  }

  onSpecStarted = (result:TExEventData) => {
    if(this.canceled) return

    this.exam.event(ExamEvents.specStart({
      data: this.clearTestResults(result),
    }))
  }

  onSuiteStarted = (result:TExEventData) => {
    if(this.canceled) return

    this.exam.event(ExamEvents.specStart({
      data: this.clearTestResults(result),
    }))
  }

  cancel = async () => {
    this.canceled = true
    this.PTE?.abort?.()

    await this.cleanup?.()
  }

  cleanup = async () => {
    this.environment.cleanup(this)
    this.environment.resetGlobals()
    this?.PTE?.clean()

    this.exam = undefined
    this.PTE = undefined
  }

  /**
  * There's a lot of meta-data that is added to the player tests results object
  * This clears out some of it, because the frontend does not need it
  */
  clearTestResults = (result:TExTestEvent|TExEventData) => {
    return omitKeys<TExTestEvent>(
      result,
      this.omitTestResults
    )
  }



}
