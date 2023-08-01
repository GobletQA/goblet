import type {
  TExCtx,
  TStateObj,
  TExFileModel,
  TExEventData,
  TExRunnerCfg,
  TExTestEvent,
} from '@gobletqa/exam'


import { FeatureEnvironment } from './FeatureEnvironment'
import { emptyArr, omitKeys, flatUnion, } from '@keg-hub/jsutils'
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
  bail?:number
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?:number
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


  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {
    // @ts-ignore
    global.jasmine.testPath = model.location

    this.isRunning = true

    const { data } = state
    this.event(ExamEvents.started)

    const content = this.fromAst.includes(model?.fileType)
      ? this.environment.parkin.parse.feature(model.content)
      : model?.content

    await this.environment.parkin.run(content, {
      ...data,
      tags: {...data?.tags},
      timeout: data?.timeout || this.timeout,
      steps: {...data?.steps, shared: {...data?.steps?.shared}}
    })

    const results = await this.environment.test.run({
      description: data?.description,
      timeout: data?.globalTimeout || this.globalTimeout
    }) as TExEventData[]

    const final = results.map(result => this.clearTestResults(result))

    this.isRunning = false

    // @ts-ignore
    global.jasmine.testPath = undefined

    if(!this.canceled) return final

    await this.cleanup()
    return emptyArr as TExEventData[]

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