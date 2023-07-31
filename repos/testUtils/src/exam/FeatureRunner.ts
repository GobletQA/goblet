import type {
  TExCtx,
  TExEventData,
  TExRunnerCfg,
  TExTestEvent,
} from '@gobletqa/exam'

import { Parkin } from '@ltipton/parkin'
import { ParkinTest } from '@ltipton/parkin/test'
import { FeatureEnvironment } from './FeatureEnvironment'
import { emptyArr, omitKeys, set, get, } from '@keg-hub/jsutils'
import type { TFeatureAst, TParkinRunStepOptsMap } from '@ltipton/parkin'
import {
  Errors,
  ExamRunner,
  ExamEvents,
  RootSuiteId,
} from '@gobletqa/exam'


export type TRunContent = string | string[] | TFeatureAst | TFeatureAst[]
export type TFeatureData = {
  steps?:TParkinRunStepOptsMap
}

export type TRunnerOpts = {
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?:number
}


export class FeatureRunner extends ExamRunner<FeatureEnvironment> {

  test:ParkinTest
  omitTestResults:string[] = []


  constructor(cfg:TExRunnerCfg, ctx:TExCtx) {
    super(cfg, ctx)

    this.isRunning = false
    
    const steps = ctx?.data?.steps

    this.test = new ParkinTest({
      specDone: this.onSpecDone,
      suiteDone: this.onSuiteDone,
      specStarted: this.onSpecStarted,
      suiteStarted: this.onSuiteStarted,
    })

    if(cfg.omitTestResults)
      this.omitTestResults = cfg.omitTestResults
  }

  /**
   * Runs the code passed to it via the exam
   */
  run = async (content:string, ctx:TExCtx) => {
    this.isRunning = true
    this.load(ctx)

    const { data, file } = ctx
    const opts = { ...data }
    const tOut = data?.timeout ?? this.globalTimeout
    tOut && (opts.timeout = tOut)

    /**
     * The required module above should use the current globals
     * Which means PTE should now be loaded with tests to run
     */
    this.exam.event(ExamEvents.started)
    const parent = this.test.getActiveParent()

    /**
     * Add the file metaData for use in events later
     * Switch `ParkinMetaData` for `metaData` once the new version of ParkinTest is published
     */
    get(parent, `describes.0.action`)
      && set(parent, `describes.0.action`, {
          ParkinMetaData: {
            file: {
              ext: file?.ext,
              name: file?.name,
              fileType: file?.fileType,
              location: file?.location,
            }
          }
        })

    const results = await this.test.run() as TExEventData[]

    const final = results.map(result => this.clearTestResults(result))

    this.isRunning = false

    if(!this.canceled) return final

    await this.cleanup()
    return emptyArr as TExEventData[]

  }

  onSpecDone = (result:TExEventData) => {
    if(this.canceled) return

    this.exam.event(ExamEvents.specDone({
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
        this.exam.event(ExamEvents.specDone({
          data: {
            ...this.clearTestResults(result),
            failedExpectations: result?.failedExpectations
          }
        }))

      let errorMsg = `Spec Failed`
      if(result.testPath) errorMsg+= ` - ${result.testPath}`
      const failedErr = Errors.TestFailed(result, new Error(errorMsg))

      this.failed += 1
      const bailAmt = this.exam.bail

      if(bailAmt && (this.failed >= bailAmt)){
        this.cancel()
        Errors.BailedTests(bailAmt, failedErr)
      }
    }
  }

  onSuiteDone = (result:TExEventData) => {
    if(this.canceled) return

    const data = this.clearTestResults(result)
    result.id === RootSuiteId
      ? this.exam.event(ExamEvents.rootSuiteDone({ data }))
      : this.exam.event(ExamEvents.suiteDone({ data }))
  }

  onSpecStarted = (result:TExEventData) => {
    if(this.canceled) return

    this.exam.event(ExamEvents.specStart({
      data: this.clearTestResults(result),
    }))
  }

  onSuiteStarted = (result:TExEventData) => {
    if(this.canceled) return

    const data = this.clearTestResults(result)
    result.id === RootSuiteId
      ? this.exam.event(ExamEvents.rootSuiteStart({ data }))
      : this.exam.event(ExamEvents.suiteStart({ data }))
  }

  cancel = async () => {
    this.canceled = true
    this.test?.abort?.()

    await this.cleanup?.()
  }

  cleanup = async () => {
    try {
      this?.test?.clean()
    }
    catch(err){}

    this.test = undefined
    this.exam = undefined
  }

  /**
  * There's a lot of meta-data that is added to the player tests results object
  * This clears out some of it, because the frontend does not need it
  */
  clearTestResults = (result:TExTestEvent|TExEventData) => {
    // TODO: update to use dot notation
    return omitKeys<TExTestEvent>(
      result,
      this.omitTestResults
    )
  }

}
