
import type { IConstructable } from './helpers.types'

export type TExReporterCfg = {
  type?:string
  jest?:boolean
}

export interface IExamReporter {
  cleanup?: () => void|Promise<void>

  // onSpecStarted(result:TExEventData):void|Promise<void>
  // onSpecDone(result:TExEventData):void|Promise<void>

  // onSuiteStarted(result:TExEventData):void|Promise<void>
  // onSuiteDone(result:TExEventData):void|Promise<void>
  
  // Event `PLAY-SUITE-DONE`
  onTestResult?: (
    ...args:any[]
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => void|Promise<void>

  // Event `PLAY-SUITE-DONE` - Top level suite-0 only
  onTestFileResult?: (
    ...args:any[]
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => void|Promise<void>

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  //  Event `PLAY-SPEC-START`
  onTestCaseStart?: (
    ...args:any[]
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => void|Promise<void>

  // Event `PLAY-SPEC-DONE`
  onTestCaseResult?: (
    ...args:any[]
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => void|Promise<void>

  // Event `PLAY-STARTED`,
  onRunStart?: (
    ...args:any[]
    // results: AggregatedResult,
    // options: ReporterOnStartOptions,
  ) => void|Promise<void>

  // Event `PLAY-SUITE-START`
  onTestStart?: (
    ...args:any[]
    // test: Test
  ) => void|Promise<void>


  // Event `PLAY-STARTED`
  onTestFileStart?: (
    ...args:any[]
    // test: Test
  ) => void|Promise<void>

  // Event `PLAY-RESULTS`
  onRunComplete?: (
    ...args:any[]
    // testContexts: Set<TestContext>,
    // results: AggregatedResult,
  ) => void|Promise<void>

  // Event `PLAY-ERROR`
  onError?: (
    ...args:any[]
  ) => void|Promise<void>

  // Event `PLAY-CANCELED`
  onCancel?: (
    ...args:any[]
  ) => void|Promise<void>

  // Event `PLAY-WARNING`
  onWarning?: (
    ...args:any[]
  ) => void|Promise<void>

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError?: (...args:any[]) => Error | void;
}

export type IExReporter<I extends IExamReporter=IExamReporter> = I & IExamReporter

export type TReporterCls = IConstructable<IExReporter>

export type TExBuiltReporters = IExReporter[]
