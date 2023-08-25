import type { TFeatureAst, TParkinRunStepOptsMap, TRootTestObj, Parkin, TParkinRunOpts } from '@ltipton/parkin'
import type {
  TStateObj,
  TExFileModel,
  TExEventData,
  TExRunnerCfg,
  TExTestEvent,
} from '@gobletqa/exam'

import { EResultAction } from '@ltipton/parkin'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { FeatureEnvironment } from './FeatureEnvironment'
import {
  Errors,
  Logger,
  ExamRunner,
  ExamEvents,
  RootSuiteId,
  EExErrorType,
  EPlayerTestType,
} from '@gobletqa/exam'



const ParkinFilterTagsError = `No tests have been registered`

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

const callAfterAllOnError = async (testRoot:TRootTestObj, parkin:Parkin) => {
  try {
    return await testRoot?.afterAll?.length
      // @ts-ignore
      && await Promise.all(testRoot.afterAll.map(fn => fn?.(parkin)))
  }
  catch(err){
    Logger.error(`AfterAll Hooks failed`)
    Logger.log(err.stack)
  }
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

    return Boolean(filter?.length)
      && content.find(feat => hasValidTags(ensureArr(filter), feat?.tags?.tokens))
  }

  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {
    // Tempt fix to make things backwards compatible
    // @ts-ignore
    global.jasmine.testPath = model.location

    let testRoot:TRootTestObj = undefined

    try {

      this.isRunning = true
      const runOpts = this.#buildRunOpts(state)
      const content = this.environment.parkin.parse.feature(model.content)
      
      if(!this.#validateRun(content, runOpts)) return emptyArr as TExEventData[]

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

      testRoot = this.environment.test.getActiveParent()

      const results = await this.environment.test.run({
        description: runOpts?.description,
        timeout: runOpts?.globalTimeout || this.globalTimeout
      }) as TExEventData[]

      const final = results.map(result => this.clearTestResults(result))

      this.isRunning = false

      // @ts-ignore
      global.jasmine.testPath = undefined

      if(!this.canceled){
        testRoot = undefined
        return final
      }

      await this.cleanup()
      return emptyArr as TExEventData[]

    }
    catch(err){
      // Ensure the after all callbacks are called
      await callAfterAllOnError(testRoot, this.environment.parkin)

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

    if(result.failed){
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

      let errorMsg = `Spec Failed`
      if(result.testPath) errorMsg+= ` - ${result.testPath}`
      const failedErr = Errors.TestFailed(result, new Error(errorMsg))

      this.failed += 1
      const bailAmt = this.bail

      if(bailAmt && (this.failed >= bailAmt)){
        this.cancel()
        Errors.BailedTests(bailAmt, failedErr)
      }
      
      throw failedErr
    }
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