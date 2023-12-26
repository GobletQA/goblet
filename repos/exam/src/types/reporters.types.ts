import type { IConstructable } from './helpers.types'

export type TExReporterCfg = {
  type?:string
  jest?:boolean
  [key:string]:any
}

export interface IExamReporter {
  cleanup?: () => unknown|Promise<unknown>

  // onSpecStart(result:TExEventData):unknown|Promise<unknown>
  // onSpecDone(result:TExEventData):unknown|Promise<unknown>

  // onSuiteStart(result:TExEventData):unknown|Promise<unknown>
  // onSuiteDone(result:TExEventData):unknown|Promise<unknown>
  
  // Event `PLAY-SUITE-DONE`
  onSuiteResult?: (
    ...args:any[]
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => unknown|Promise<unknown>

  // Event `PLAY-SUITE-DONE` - Top level suite-0 only
  onTestFileResult?: (
    ...args:any[]
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => unknown|Promise<unknown>

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  //  Event `PLAY-SPEC-START`
  onTestStart?: (
    ...args:any[]
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => unknown|Promise<unknown>

  // Event `PLAY-SPEC-DONE`
  onTestResult?: (
    ...args:any[]
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => unknown|Promise<unknown>

  // Event `PLAY-STARTED`,
  onRunStart?: (
    ...args:any[]
    // results: AggregatedResult,
    // options: ReporterOnStartOptions,
  ) => unknown|Promise<unknown>

  // Event `PLAY-SUITE-START`
  onSuiteStart?: (
    ...args:any[]
    // test: Test
  ) => unknown|Promise<unknown>


  // Event `PLAY-STARTED`
  onTestFileStart?: (
    ...args:any[]
    // test: Test
  ) => unknown|Promise<unknown>

  // Event `PLAY-RESULTS`
  onRunResult?: (
    ...args:any[]
    // testContexts: Set<TestContext>,
    // results: AggregatedResult,
  ) => unknown|Promise<unknown>

  // Event `PLAY-ERROR`
  onError?: (
    ...args:any[]
  ) => unknown|Promise<unknown>

  // Event `PLAY-CANCELED`
  onCancel?: (
    ...args:any[]
  ) => unknown|Promise<unknown>

  // Event `PLAY-WARNING`
  onWarning?: (
    ...args:any[]
  ) => unknown|Promise<unknown>

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError?: (...args:any[]) => Error | void;
}

export type IExReporter<I extends IExamReporter=IExamReporter> = I & IExamReporter

export type TReporterCls = IConstructable<IExReporter>

export type TExBuiltReporters = IExReporter[]
