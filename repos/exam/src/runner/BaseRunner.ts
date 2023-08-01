import type {
  TExCtx,
  TExEventData,
  TExFileModel,
  TExRunnerCfg,
  TExTestEvent,
  TStateObj,
} from '@GEX/types'

import { ExamEvents } from '@GEX/Events'
import { ExamRunner } from './ExamRunner'
import { Errors } from '@GEX/constants/errors'
import { ParkinTest } from '@ltipton/parkin/test'
import { RootSuiteId } from '@GEX/constants/events'
import { emptyArr, omitKeys, set, get, } from '@keg-hub/jsutils'
import {BaseEnvironment} from '@GEX/environment/BaseEnvironment'

export class BaseRunner extends ExamRunner<BaseEnvironment> {

  test:ParkinTest
  bail:number=0
  omitTestResults:string[] = []


  constructor(cfg:TExRunnerCfg, state:TStateObj) {
    super(cfg, state)

    this.isRunning = false
    this.test = new ParkinTest({
      specDone: this.onSpecDone,
      suiteDone: this.onSuiteDone,
      specStarted: this.onSpecStarted,
      suiteStarted: this.onSuiteStarted,
    })

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

    const { data } = state
    const opts = { ...data }
    const tOut = data?.timeout ?? this.globalTimeout
    tOut && (opts.timeout = tOut)

    /**
     * The required module above should use the current globals
     * Which means PTE should now be loaded with tests to run
     */
    this.event(ExamEvents.started)
    const parent = this.test.getActiveParent()

    /**
     * Add the file metaData for use in events later
     * Switch `ParkinMetaData` for `metaData` once the new version of ParkinTest is published
     */
    get(parent, `describes.0.action`)
      && set(parent, `describes.0.action`, {
          ParkinMetaData: {
            file: {
              ext: model?.ext,
              name: model?.name,
              fileType: model?.fileType,
              location: model?.location,
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
    this.test?.abort?.()

    await this.cleanup?.()
  }

  cleanup = async () => {
    try {
      this?.test?.clean()
    }
    catch(err){}

    this.test = undefined
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
