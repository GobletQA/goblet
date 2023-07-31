import type {
  TExCtx,
  TStateObj,
  TExFileModel,
  TExEventData,
  TExRunnerCfg,
  TExTestEvent,
} from '@gobletqa/exam'


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
  bail?:number
  debug?: boolean
  slowMo?: number
  timeout?: number
  globalTimeout?:number
}

export class FeatureRunner extends ExamRunner<FeatureEnvironment> {

  bail:number=0
  omitTestResults:string[] = []


  constructor(cfg:TExRunnerCfg, ctx:TExCtx) {

    super(cfg, ctx)

    this.bail = cfg.bail
    this.isRunning = false
    const steps = ctx?.data?.steps
    this.environment = ctx.environment
    
    this.environment.setup(this)

    if(cfg.omitTestResults)
      this.omitTestResults = cfg.omitTestResults
  }

  event = (args:any) => {
    
  }

  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {

    this.isRunning = true

    // const { data, file } = ctx
    // const opts = { ...data }
    // const tOut = data?.timeout ?? this.globalTimeout
    // tOut && (opts.timeout = tOut)

    this.event(ExamEvents.started)

    // const ast = this.environment.parkin.parse.feature(model.content)
    await this.environment.parkin.run(model.content, {})

    const results = await this.environment.test.run() as TExEventData[]

    const final = results.map(result => this.clearTestResults(result))

    this.isRunning = false

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
      this.environment?.cleanup?.(this)
    }
    catch(err){}

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


export default FeatureRunner