import type {
  TFeatureAst,
  TRootTestObj,
  TParkinRunOpts,
  TParkinRunStepOptsMap,
} from '@ltipton/parkin'
import type {
  TStateObj,
  TExFileModel,
  TExEventData,
  TExRunnerCfg,
  TExTestEvent,
} from '@gobletqa/exam'

import { EResultAction } from '@ltipton/parkin'
import { FeatureEnvironment } from './Environment'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import {
  Errors,
  ExamRunner,
  ExamEvents,
  RootSuiteId,
  EExErrorType,
  EPlayerTestType,
} from '@gobletqa/exam'


export type TRunContent = string | string[] | TFeatureAst | TFeatureAst[]
export type TFeatureData = {
  steps?:TParkinRunStepOptsMap
}

export type TRunnerOpts = {
  bail?:number
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?:number
}

const hasValidTags = (
  filter:string[],
  tags?:string[]
) => {
  return !filter?.length
    || (tags?.length && filter?.every((clientTag:string) => tags?.includes(clientTag)))
}

export class FeatureRunner extends ExamRunner<FeatureEnvironment> {

  bail:number=0
  fromAst:string[]=[`feature`]
  omitTestResults:string[] = [
    `tests`,
    `describes`,
    `passedExpectations`,
    `failedExpectations`,
  ]

  constructor(cfg:TExRunnerCfg, state:TStateObj) {
    super(cfg, state)

    this.bail = cfg.bail
    this.isRunning = false
    this.environment.setup(this)

    cfg.omitTestResults
      && (this.omitTestResults = flatUnion(this.omitTestResults, cfg.omitTestResults))
  }

  #buildRunOpts = (state:TStateObj) => {
    const { data } = state
    const runOptions = this.environment.runOptions

    return deepMerge(runOptions, {
      ...data,
      tags: {...data?.tags},
      timeout: data?.timeout || this.timeout,
      steps: {...data?.steps, shared: {...data?.steps?.shared}},
    })

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

  #checkBail = (result:TExEventData) => {
    let errorMsg = `Spec Failed`
    if(result.testPath) errorMsg+= ` - ${result.testPath}`
    const failedErr = Errors.TestFailed(result, new Error(errorMsg))

    this.failed += 1
    const bailAmt = this.bail

    if(bailAmt && (this.failed >= bailAmt)){
      this.cancel()
      Errors.BailedTests(bailAmt, failedErr)
    }

    return failedErr
  }

  #onSpecFailed = (result:TExEventData) => {
    /**
      * TODO check here for failed state in result metadata
      * Could allow for test warning, but not failing
      * Need to add `warnOnFailed` to `result.metaData` in Parkin
      */
    // @ts-ignore
    if(result?.metaData?.warnOnFailed)
      this.event(ExamEvents.specDone({
        data: {
          ...this.clearTestResults(result),
          failedExpectations: result?.failedExpectations
        }
      }))

    const failedErr = this.#checkBail(result)
    if(failedErr) throw failedErr
  }

  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {

    try {

      this.isRunning = true
      const runOpts = this.#buildRunOpts(state)
      const content = this.environment.parkin.parse.feature(model.content)
      
      if(!this.#validateRun(content, runOpts))
        return emptyArr as TExEventData[]

      this.event({
        ...ExamEvents.started,
        data: {
          id: model.name,
          timestamp:  Date.now(),
          testPath: model.location,
          action: EResultAction.start,
          fullName: model.location,
          type: EPlayerTestType.feature,
          description: `Starting test execution`,
        }
      })

      await this.environment.parkin.run(content, runOpts)

      const results = await this.environment.test.run({
        description: runOpts?.description,
        timeout: runOpts?.globalTimeout || this.globalTimeout
      }) as TExEventData[]

      const final = results.map(result => this.clearTestResults(result))

      this.isRunning = false

      if(!this.canceled) return final

      await this.cleanup()
      return emptyArr as TExEventData[]

    }
    catch(err){
      if(err.name === EExErrorType.TestErr){
        const cleaned = this.clearTestResults(err.result)
        return [cleaned]
      }

      await this.cleanup()
      throw err
    }

  }

  onSpecDone = (result:TExEventData) => {
    if(this.canceled) return

    this.event(ExamEvents.specDone({
      data: {
        ...this.clearTestResults(result),
        failedExpectations: result?.failedExpectations
      }
    }))

    result.failed && this.#onSpecFailed(result)
  }

  onSuiteDone = (result:TExEventData) => {
    if(this.canceled) return

    const data = this.clearTestResults(result)
    result.id === RootSuiteId
      ? this.event(ExamEvents.rootSuiteDone({ data }))
      : this.event(ExamEvents.suiteDone({ data }))
  }

  onSpecStarted = (result:TExEventData) => {
    if(this.canceled) return

    this.event(ExamEvents.specStart({
      data: this.clearTestResults(result),
    }))
  }

  onSuiteStarted = (result:TExEventData) => {
    if(this.canceled) return

    const data = this.clearTestResults(result)
    result.id === RootSuiteId
      ? this.event(ExamEvents.rootSuiteStart({ data }))
      : this.event(ExamEvents.suiteStart({ data }))
  }

  cancel = async () => {
    this.canceled = true
    this.environment?.test?.abort?.()

    await this.cleanup?.()
  }

  cleanup = async () => {
    try {
      this.isRunning = false
      this.environment?.cleanup?.()
    }
    catch(err){}

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


export default FeatureRunner