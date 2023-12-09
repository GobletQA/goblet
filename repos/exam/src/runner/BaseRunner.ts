import type {
  TStateObj,
  TExEventData,
  TExFileModel,
  TExRunnerCfg,
} from '@GEX/types'

import { ExamRunner } from './ExamRunner'
import { set } from '@keg-hub/jsutils/set'
import { get } from '@keg-hub/jsutils/get'
import { RootSuiteId } from '@GEX/constants'
import { ExamEvents } from '@GEX/events/Events'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
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

    const final = results.map(result => this.cleanExResult(result))

    this.isRunning = false

    if(!this.canceled) return final

    await this.cleanup()
    return emptyArr as TExEventData[]

  }


  cancel = async () => {
    this.canceled = true
    this.environment.test?.abort?.()

    await this.cleanup?.()
  }

}
