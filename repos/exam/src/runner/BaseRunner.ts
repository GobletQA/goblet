import type {
  TExCtx,
  TExEventData,
  TExRunnerCfg,
  TExTestEvent,
} from '@GEX/types'


import { ExamEvents } from '@GEX/Events'
import { ExamRunner } from './ExamRunner'
import { Errors } from '@GEX/constants/errors'
import { ParkinTest } from '@ltipton/parkin/test'
import { RootSuiteId } from '@GEX/constants/events'
import { emptyArr, omitKeys } from '@keg-hub/jsutils'


export class BaseRunner extends ExamRunner {

  executor:ParkinTest
  omitTestResults:string[] = []


  constructor(cfg:TExRunnerCfg, ctx:TExCtx) {
    super(cfg, ctx)

    this.isRunning = false
    this.executor = new ParkinTest({
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
    this.load(content, ctx)

    /**
     * Imports the module from a string using Nodes built-in vm module
     * Currently sets `useCurrentGlobal: true`, to use the currently globals
     * Eventually this will be updated to not do that
     */
    // requireFromStringVM(ctx.file, content, {
    //   filename: file.name,
    //   useCurrentGlobal: true,
    //   dirname: path.dirname(file.location),
    // })

    const { data } = ctx
    const opts = { ...data }
    const tOut = data?.timeout ?? this.globalTimeout
    tOut && (opts.timeout = tOut)


    /**
     * The required module above should use the current globals
     * Which means PTE should now be loaded with tests to run
     */
    this.exam.event(ExamEvents.started)
    const results = await this.executor.run() as TExEventData[]
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
      
      this.cancel()
      let errorMsg = `Spec Failed`
      if(result.testPath) errorMsg+= ` - ${result.testPath}`

      Errors.TestFailed(result, new Error(errorMsg))
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
    this.executor?.abort?.()

    await this.cleanup?.()
  }

  cleanup = async () => {
    try {
      this?.executor?.clean()
    }
    catch(err){}

    this.executor = undefined
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
