import type {
  TStateObj,
  TExEventData,
  TExFileModel,
  TExRunnerCfg,
  TExTestEvent,
} from '@GEX/types'

import { ExamRunner } from './ExamRunner'
import { set } from '@keg-hub/jsutils/set'
import { get } from '@keg-hub/jsutils/get'
import { RootSuiteId } from '@GEX/constants'
import { ExamEvents } from '@GEX/events/Events'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import {BaseEnvironment} from '@GEX/environment/BaseEnvironment'


export class BaseRunner extends ExamRunner<BaseEnvironment> {

  omitTestResults:string[] = []

  constructor(cfg:TExRunnerCfg, state:TStateObj) {
    super(cfg, state)

    this.isRunning = false
    this.environment.setup(this)

    if(cfg.omitTestResults)
      this.omitTestResults = cfg.omitTestResults
  }


  /**
   * Runs the code passed to it via the exam
   */
  run = async (model:TExFileModel, state:TStateObj) => {
    this.isRunning = true
    const { data } = state

    state.require(model.location)

    /**
     * The required module above should use the current globals
     * Which means PTE should now be loaded with tests to run
     */
    this.event(ExamEvents.started)
    const parent = this.environment.test.getActiveParent()

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

    const results = await this.environment.test.run({
      description: data?.description,
      testTimeout: data?.testTimeout || this.testTimeout,
      suiteTimeout: data?.suiteTimeout || this.suiteTimeout,
    }) as TExEventData[]

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
    this.environment.test?.abort?.()

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
    // TODO: update to use dot notation
    return omitKeys<TExTestEvent>(
      result,
      this.omitTestResults
    )
  }

}
