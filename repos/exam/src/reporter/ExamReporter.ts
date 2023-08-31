import type {
  TExamConfig,
  TExReporterCfg,
  TEXInterReporterContext,
  IExamReporter,
} from "@GEX/types"

export class ExamReporter implements IExamReporter {
  config:TExamConfig

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext:TEXInterReporterContext
  ) {
    this.config = examCfg
  }

  // Event `PLAY-SUITE-DONE`
  onSuiteResult = (
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => {

  }

  // Event `PLAY-SUITE-DONE` - Top level suite-0 only
  onTestFileResult = (
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => {
    
  }

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  //  Event `PLAY-SPEC-START`
  onTestStart = (
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    
  }

  // Event `PLAY-SPEC-DONE`
  onTestResult = (
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    
  }

  // Event `PLAY-STARTED`,
  onRunStart = (
    // results: AggregatedResult,
    // options: ReporterOnStartOptions,
  ) => {
    
  }

  // Event `PLAY-SUITE-START`
  onSuiteStart = (
    // test: Test
  ) => {
    
  }


  // Event `PLAY-STARTED`
  onTestFileStart = (
    // test: Test
  ) => {
    
  }

  // Event `PLAY-RESULTS`
  onRunResult = (
    // testContexts: Set<TestContext>,
    // results: AggregatedResult,
  ) => {
    
  }

  // Optionally, reporters can force Jest to exit with non zero code by returning
  // an `Error` from `getLastError()` method.
  getLastError = () => {
    // Error | void;
  }

  cancel = () => {
    
  }

  cleanup = () => {
    
  }

}
