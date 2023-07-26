import type { Exam } from "@GEX/Exam"
import type {
  TExamConfig,
  IExamReporter,
  TExReporterCfg,
  TEXInterReporterContext,
} from "@GEX/types"


  // specDone: `PLAY-SPEC-DONE`,
  // specStart: `PLAY-SPEC-START`,
  // suiteDone: `PLAY-SUITE-DONE`,
  // suiteStart: `PLAY-SUITE-START`,
  // ended: `PLAY-ENDED`,
  // error: `PLAY-ERROR`,
  // action: `PLAY-ACTION`,
  // general: `PLAY-GENERAL`,
  // results: `PLAY-RESULTS`,
  // started: `PLAY-STARTED`,
  // canceled: `PLAY-CANCELED`,
  // stopped: `PLAY-STOPPED`,

export class SilentReporter implements IExamReporter {
  exam:Exam
  config:TExamConfig

  constructor(
    examCfg:TExamConfig,
    cfg:TExReporterCfg,
    reporterContext:TEXInterReporterContext
  ) {
    this.config = examCfg
    this.exam = cfg.exam
  }

  // Event `PLAY-SUITE-DONE`
  onTestResult = (
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
  onTestCaseStart = (
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    
  }

  // Event `PLAY-SPEC-DONE`
  onTestCaseResult = (
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
  onTestStart = (
    // test: Test
  ) => {
    
  }


  // Event `PLAY-STARTED`
  onTestFileStart = (
    // test: Test
  ) => {
    
  }

  // Event `PLAY-RESULTS`
  onRunComplete = (
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
