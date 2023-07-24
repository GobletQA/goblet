import type {
  TExCtx,
  TExEventData,
  TExRunnerCfg,
  TExTestEvent,
} from '@GEX/types'

import path from 'path'
import { ExamEvents } from '@GEX/Events'
import { ExamRunner } from './ExamRunner'
import {RunnerErr} from '@GEX/utils/error'
import { ParkinTest } from '@ltipton/parkin/test'
import {emptyArr, omitKeys} from '@keg-hub/jsutils'
import { requireFromString } from 'module-from-string'
import { BaseEnvironment } from '@GEX/environment/BaseEnvironment'

export class BaseRunner extends ExamRunner {

  PTE:ParkinTest
  environment:BaseEnvironment
  omitTestResults:string[] = [
    // `tests`,
    // `describes`,
    // `passedExpectations`,
    // `failedExpectations`,
  ]

  constructor(cfg:TExRunnerCfg, ctx:TExCtx) {
    super(cfg, ctx)

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
  run = async (content:string, ctx:TExCtx) => {
    this.isRunning = true

    const { file } = ctx
    this.PTE = this.environment.setupGlobals(this, ctx)

    /**
     * Imports the module from a string using Nodes built-in vm module
     * Currently sets `useCurrentGlobal: true`, to use the currently globals
     * Eventually this will be updated to not do that
     */
    requireFromString(content, {
      filename: file.name,
      useCurrentGlobal: true,
      dirname: path.dirname(file.location),
    })

    /**
     * The required module above should use the current globals
     * Which means PTE should now be loaded with tests to run
     */
    const results = await this.PTE.run() as TExEventData[]
    const final = results.map(result => this.clearTestResults(result))
    await this.cleanup()

    return this.canceled ? emptyArr as TExEventData[] : final
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
    this.environment.resetGlobals(this)
    this.environment.cleanup(this)
    this?.PTE?.clean()

    this.PTE = undefined
    this.exam = undefined
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
