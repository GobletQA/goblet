import type {
  TFeatureAst,
  TParkinRunOpts,
  TParkinRunStepOptsMap,
} from '@ltipton/parkin'
import type {
  TStateObj,
  TExFileModel,
  TExEventData,
  TExRunnerCfg,
} from '@gobletqa/exam'

import { FeatureEnvironment } from './Environment'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'

import {
  ExamRunner,
  ExamEvents,
  EExErrorType,
  EPlayerTestType,
} from '@gobletqa/exam'


export type TRunContent = string | string[] | TFeatureAst | TFeatureAst[]
export type TFeatureData = {
  steps?:TParkinRunStepOptsMap
}

export type TRunnerOpts = {
  debug?: boolean
  slowMo?: number
  testTimeout?: number
  suiteTimeout?:number
}

const hasValidTags = (
  filter:string[],
  tags?:string[]
) => {
  return !filter?.length
    || (tags?.length && filter?.every((clientTag:string) => tags?.includes(clientTag)))
}

export class FeatureRunner extends ExamRunner<FeatureEnvironment> {

  fromAst:string[]=[`feature`]
  omitTestResults:string[] = [
    `tests`,
    `describes`,
    `passedExpectations`,
    `failedExpectations`,
  ]

  constructor(cfg:TExRunnerCfg, state:TStateObj) {
    super(cfg, state)

    this.isRunning = false
    this.environment.setup(this)

    cfg.omitTestResults
      && (this.omitTestResults = flatUnion(this.omitTestResults, cfg.omitTestResults))

  }

  #buildRunOpts = (model:TExFileModel, state:TStateObj) => {
    const { data } = state

    // TODO: include bail in the run options
    const parkinOpts = deepMerge(this.environment.runOptions, {
      ...data,
      tags: {...data?.tags},
      timeout: data?.testTimeout || this.testTimeout,
      steps: {...data?.steps, shared: {...data?.steps?.shared}},
    })

    return {
      parkin: parkinOpts,
      test: {
        bail: this.bail,
        testRetry: this.testRetry,
        suiteRetry: this.suiteRetry,
        testTimeout: this.testTimeout,
        suiteTimeout: this.suiteTimeout,
        /**
         * When running a single test from UI
         * This should be set to true so running stops on the first failed test
         */
        exitOnFailed: this.exitOnFailed,
        skipAfterFailed: this.skipAfterFailed,
        /**
         * Bind Runner event listeners to the currently running model
         * Ensures we can keep track of the test that called the event callback
         */
        ...this.bindEvents({ result: { location: model.location }}, model)
      }
    }

  }

  #validateRun = (
    content:TFeatureAst[],
    runOpts:TParkinRunOpts
  ) => {
    const filter = runOpts?.tags?.filter
    const hasFilters = Boolean(filter?.length)
    if(!hasFilters) return true

    return hasFilters
      && content.find(feat => hasValidTags(ensureArr(filter), feat?.tags?.tokens))
  }

  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {
    try {

      this.isRunning = true
      const runOpts = this.#buildRunOpts(model, state)
      const content = this.environment.parkin.parse.feature(model.content)

      if(!this.#validateRun(content, runOpts.parkin))
        return emptyArr as TExEventData[]

      // This must come before the parkin run
      // Otherwise the steps will have the default timeout
      // Which is too short for some steps
      this.environment.test.setConfig(runOpts.test)
      await this.environment.parkin.run(content, runOpts.parkin)

      const results = await this.environment.test.run() as TExEventData[]
      this.isRunning = false

      if(this.canceled){
        await this.cleanup()
        return emptyArr as TExEventData[]
      }

      return results.map(result => this.cleanExResult(result))

    }
    catch(err){

      if(err.name === EExErrorType.TestErr){
        if(!err.result) return []
        return [this.cleanExResult(err.result)]
      }

      await this.cleanup()
      throw err
    }
  }

  /**
   * Override the default method to allow passing the model data
   */
  onRunStart = (result:TExEventData, model:TExFileModel) => {
    this.event(ExamEvents.started({
      data: {
        ...this.cleanExResult(result),
        id: model.name,
        testPath: model.location,
        fullName: model.location,
        type: EPlayerTestType.feature,
      }
    }))
  }

  cancel = async () => {
    this.canceled = true
    this.environment?.test?.abort?.()
    this.cleanup?.()
  }

}


export default FeatureRunner