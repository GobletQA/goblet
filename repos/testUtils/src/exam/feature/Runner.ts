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
  TExTestEvent,
} from '@gobletqa/exam'

import { FeatureEnvironment } from './Environment'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { splitByKeys } from '@keg-hub/jsutils/splitByKeys'

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
    // `tests`,
    // `describes`,
    // `passedExpectations`,
    // `failedExpectations`,
  ]

  constructor(cfg:TExRunnerCfg, state:TStateObj) {
    super(cfg, state)

    this.bail = cfg.bail
    this.isRunning = false
    this.environment.setup(this)

    cfg.omitTestResults
      && (this.omitTestResults = flatUnion(this.omitTestResults, cfg.omitTestResults))
  }

  #buildRunOpts = (model:TExFileModel, state:TStateObj) => {
    const { data } = state
    const { location } = model

    const parkinOpts = deepMerge(this.environment.runOptions, {
      ...data,
      tags: {...data?.tags},
      timeout: data?.timeout || this.timeout,
      steps: {...data?.steps, shared: {...data?.steps?.shared}},
    })

    const [
      tOpts,
      pOpts
    ] = splitByKeys(parkinOpts, [`retry`, `exitOnFailed`, `skipAfterFailed`, `globalTimeout`])

    return {
      parkin: pOpts,
      test: {
        retry: tOpts?.retry ?? 0,
        description: tOpts?.description,
        exitOnFailed: tOpts?.exitOnFailed ?? false,
        skipAfterFailed: tOpts?.skipAfterFailed ?? true,
        timeout: tOpts?.globalTimeout || this.globalTimeout,

        onSpecDone: (result:TExEventData) => this.onSpecDone.call(this, {...result, location }),
        onSpecStart: (result:TExEventData) => this.onSpecStarted.call(this, {...result, location }),

        onSuiteDone: (result:TExEventData) => this.onSuiteDone.call(this, {...result, location }),
        onSuiteStart: (result:TExEventData) => this.onSuiteStarted.call(this, {...result, location }),

        onRunDone: (result:TExEventData) => this.onRunDone.call(this, {...result, location }),
        onRunStart: (result:TExEventData) => this.onRunStart.call(this, {...result, location }, model),
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

  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {
    try {

      this.isRunning = true
      const runOpts = this.#buildRunOpts(model, state)
      const content = this.environment.parkin.parse.feature(model.content)
      
      console.log(`------- runOpts -------`)
      console.log(runOpts)
      
      if(!this.#validateRun(content, runOpts.parkin))
        return emptyArr as TExEventData[]

      await this.environment.parkin.run(content, runOpts.parkin)
      const results = await this.environment.test.run(runOpts.test) as TExEventData[]

      console.log(`------- run restuls -------`)
      console.log(require('util').inspect(results, false, null, true))


      this.isRunning = false

      if(this.canceled){
        await this.cleanup()
        return emptyArr as TExEventData[]
      }

      return results.map(result => this.clearTestResults(result))

    }
    catch(err){
      if(err.name === EExErrorType.TestErr){
        if(!err.result) return []
        return [this.clearTestResults(err.result)]
      }

      await this.cleanup()
      throw err
    }

  }

  onRunStart = (result:TLocEvt, model:TExFileModel) => {
    this.event({
      ...ExamEvents.started,
      data: {
        ...this.clearTestResults(result),
        id: model.name,
        testPath: model.location,
        fullName: model.location,
        type: EPlayerTestType.feature,
      }
    })
  }

  onRunDone = (result:TLocEvt) => {
    this.event(ExamEvents.results({ data: result }))
  }

  onSpecDone = (result:TLocEvt) => {
    if(this.canceled) return

    this.event(ExamEvents.specDone({
      data: {
        ...this.clearTestResults(result),
        failedExpectations: result?.failedExpectations
      }
    }))

    if(!result.failed) return

    const failedErr = this.#checkBail(result)
    if(failedErr) throw failedErr

  }

  onSuiteDone = (result:TLocEvt) => {
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
  clearTestResults = (result:TExEventData) => {
    return omitKeys<TExTestEvent>(
      result,
      this.omitTestResults
    )
  }

}


export default FeatureRunner