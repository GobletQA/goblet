
export class JestReporter {
  
  constructor(
    // globalConfig,
    // reporterOptions,
    // reporterContext
  ){
    
  }
  
  onSuiteResult: (
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
  onTestStart: (
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    
  }

  onTestResult: (
    // test: Test,
    // testCaseStartInfo: TestCaseStartInfo,
  ) => {
    
  }

  onRunStart: (
    // results: AggregatedResult,
    // options: ReporterOnStartOptions,
  ) => Promise<void> | void;

  onSuiteStart?: (
    // test: Test
  ) => {
    
  }

  onTestFileStart?: (
    // test: Test
  ) => {
    
  }

  onRunResult: (
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