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

import { EResultAction, TRunResult } from '@ltipton/parkin'
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

export type TLocEvt = (TExEventData & { location:string })

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

  #onSpecFailed = (result:TLocEvt) => {
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

  #onRunStart = (model:TExFileModel) => {
    this.event({
      ...ExamEvents.started,
      data: {
        id: model.name,
        timestamp:  Date.now(),
        testPath: model.location,
        fullName: model.location,
        action: EResultAction.start,
        type: EPlayerTestType.feature,
        description: `Starting test execution`,
      }
    })
  }

  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {
    const location = model.location

    try {

      this.isRunning = true

      const runOpts = this.#buildRunOpts(state)
      const content = this.environment.parkin.parse.feature(model.content)
      
      if(!this.#validateRun(content, runOpts))
        return emptyArr as TExEventData[]

      this.#onRunStart(model)

      await this.environment.parkin.run(content, runOpts)

      const results = await this.environment.test.run({
        description: runOpts?.description,
        timeout: runOpts?.globalTimeout || this.globalTimeout,
        specDone: (result:TExEventData) => this.onSpecDone.call(this, {...result, location }),
        suiteDone: (result:TExEventData) => this.onSuiteDone.call(this, {...result, location }),
        specStarted: (result:TExEventData) => this.onSpecStarted.call(this, {...result, location }),
        suiteStarted: (result:TExEventData) => this.onSuiteStarted.call(this, {...result, location })
      }) as TExEventData[]

      this.isRunning = false

      if(this.canceled){
        await this.cleanup()
        return emptyArr as TExEventData[]
      }

      return results.map(result => this.clearTestResults({...result, location}))

    }
    catch(err){
      if(err.name === EExErrorType.TestErr){
        const cleaned = this.clearTestResults({...err.result, location})
        return [cleaned]
      }

      await this.cleanup()
      throw err
    }

  }

  onSpecDone = (result:TLocEvt) => {
    if(this.canceled) return

    this.event(ExamEvents.specDone({
      data: {
        ...this.clearTestResults(result),
        failedExpectations: result?.failedExpectations
      }
    }))

    result.failed && this.#onSpecFailed(result)
  }

  onSuiteDone = (result:TLocEvt) => {
    console.log(`------- on suite done -------`)
    
    if(this.canceled) return

    const data = this.clearTestResults(result)
    result.id === RootSuiteId
      ? this.event(ExamEvents.rootSuiteDone({ data }))
      : this.event(ExamEvents.suiteDone({ data }))
  }

  onSpecStarted = (result:TLocEvt) => {
    if(this.canceled) return

    this.event(ExamEvents.specStart({
      data: this.clearTestResults(result),
    }))
  }

  onSuiteStarted = (result:TLocEvt) => {
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
  clearTestResults = (result:TExTestEvent|TLocEvt) => {
    return omitKeys<TExTestEvent>(
      result,
      this.omitTestResults
    )
  }

}


export default FeatureRunner