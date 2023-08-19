
export class JestReporter {
  
  constructor(
    // globalConfig,
    // reporterOptions,
    // reporterContext
  ){
    
  }
  
  onTestResult: (
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => {

  }

  onTestFileResult?: (
    // test: Test,
    // testResult: TestResult,
    // aggregatedResult: AggregatedResult,
  ) => {
    
  }

  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  onTestCaseStart: (
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    
  }

  onTestCaseResult: (
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    
  }

  onRunStart: (
    // results: AggregatedResult,
    // options: ReporterOnStartOptions,
  ) => Promise<void> | void;

  onTestStart?: (
    // test: Test
  ) => {
    
  }

  onTestFileStart?: (
    // test: Test
  ) => {
    
  }

  onRunComplete: (
    // testContexts: Set<TestContext>,
    // results: AggregatedResult,
  ) => {
    
  }

  getLastError: () => {
    // Error | void;
  }
}

const jestReporter = new JestReporter()

const JestReporterHandler = {
  construct(target, argumentsList, newTarget) {
    return Reflect.construct<
      typeof argumentsList,
      JestReporter
    >(target, argumentsList, newTarget)
  },

  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver)
  },
  
  set(obj, prop, value) {
    return Reflect.set(obj, prop, value)
  }
}


const jestProxy = new Proxy<JestReporter>(jestReporter, JestReporterHandler)