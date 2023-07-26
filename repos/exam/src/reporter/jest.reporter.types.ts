type GlobalConfig = {
  bail: number
  rootDir: string
  silent?: boolean
  verbose?: boolean
  reporters?: Array<string>
  passWithNoTests: boolean
  maxWorkers: number // => examCfg.workers
  maxConcurrency: number // => examCfg.concurrency
  globalSetup?: string // => examCfg.preRunner
  globalTeardown?: string // => examCfg.postRunner
  testTimeout?: number // => examCfg.timeout

  // ---- These options should be easy to implement ---- //
  // ci: boolean;
  // filter?: string;
  // runTestsByPath: boolean;
  // testPathPattern: string;
  // testNamePattern?: string;
  // testFailureExitCode: number;
  // ---- These options should be easy to implement ---- //

  // changedSince?: string;
  // changedFilesWithAncestor: boolean;
  // detectLeaks: boolean;
  // detectOpenHandles: boolean;
  // expand: boolean;
  // findRelatedTests: boolean;
  // forceExit: boolean;
  // json: boolean;
  // lastCommit: boolean;
  // logHeapUsage: boolean;
  // listTests: boolean;
  // noStackTrace: boolean;
  // nonFlagArgs: Array<string>;
  // noSCM?: boolean;
  // notify: boolean;
  // notifyMode: NotifyMode;
  // outputFile?: string;
  // onlyChanged: boolean;
  // onlyFailures: boolean;
  // projects: Array<string>;
  // replname?: string;

  // seed: number;
  // showSeed?: boolean;
  // useStderr: boolean;
  // skipFilter: boolean;
  // errorOnDeprecated: boolean;
  // testResultsProcessor?: string;
  // testSequencer: string;
  // watch: boolean;
  // watchAll: boolean;
  // collectCoverage: boolean;
  // collectCoverageFrom: Array<string>;
  // coverageDirectory: string;
  // coveragePathIgnorePatterns?: Array<string>;
  // coverageProvider: CoverageProvider;
  // coverageReporters: CoverageReporters;
  // coverageThreshold?: CoverageThreshold;
  // watchman: boolean;
  // workerIdleMemoryLimit?: number;
  // watchPlugins?: Array<{
  //   path: string;
  //   config: Record<string, unknown>;
  // }> | null;
  // shard?: ShardConfig;
  // snapshotFormat: SnapshotFormat;
  // updateSnapshot: SnapshotUpdateState;
};


type ReporterContext = {
  firstRun: boolean;
  previousSuccess: boolean;
  changedFiles?: Set<string>;
  sourcesRelatedToTestsInChangedFiles?: Set<string>;
  startRun?: (globalConfig: GlobalConfig) => unknown;
};

type SummaryOptions = {
  currentTestCases?: Array<{test: Test; testCaseResult: AssertionResult}>;
  estimatedTime?: number;
  roundTime?: boolean;
  width?: number;
  showSeed?: boolean;
  seed?: number;
};

type Test = {
  context: TestContext;
  duration?: number;
  path: string;
};

type TestContext = {
  config: any
  hasteFS: any
  moduleMap: any
  resolver: any
};


type TestResult = {
  failureMessage?: string | null;
  leaks: boolean;
  memoryUsage?: number;
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
  numTodoTests: number;
  openHandles: Array<Error>;
  perfStats: {
    end: number;
    runtime: number;
    slow: boolean;
    start: number;
  };
  skipped: boolean;
  snapshot: {
    added: number;
    fileDeleted: boolean;
    matched: number;
    unchecked: number;
    uncheckedKeys: Array<string>;
    unmatched: number;
    updated: number;
  };
  testFilePath: string;
  testResults: Array<AssertionResult>;
  console?: any
  coverage?: any
  v8Coverage?: any
  displayName?: any
  testExecError?: any
};


type Status =
  | 'passed'
  | 'failed'
  | 'skipped'
  | 'pending'
  | 'todo'
  | 'disabled'
  | 'focused';

type Callsite = {
  column: number;
  line: number;
};

// this is here to make it possible to avoid huge dependency trees just for types
type AssertionResult = {
  ancestorTitles: Array<string>;
  duration?: number | null;
  failureDetails: Array<unknown>;
  failureMessages: Array<string>;
  fullName: string;
  invocations?: number;
  location?: Callsite | null;
  numPassingAsserts: number;
  retryReasons?: Array<string>;
  status: Status;
  title: string;
};

type SerializableError = {
  code?: unknown;
  type?: string;
  message: string;
  stack: string | null | undefined;
};

type AggregatedResult = AggregatedResultWithoutCoverage & {
  coverageMap?: any | null;
};

type TestCaseResult = AssertionResult;

type AggregatedResultWithoutCoverage = {
  numFailedTests: number;
  numFailedTestSuites: number;
  numPassedTests: number;
  numPassedTestSuites: number;
  numPendingTests: number;
  numTodoTests: number;
  numPendingTestSuites: number;
  numRuntimeErrorTestSuites: number;
  numTotalTests: number;
  numTotalTestSuites: number;
  openHandles: Array<Error>;
  snapshot: any;
  startTime: number;
  success: boolean;
  testResults: Array<TestResult>;
  wasInterrupted: boolean;
  runExecError?: any;
};


type TestCaseStartInfo = {
  ancestorTitles: Array<string>;
  fullName: string;
  mode: TestMode;
  title: string;
  startedAt?: number | null;
};

type BlockMode = void | 'skip' | 'only' | 'todo';
type TestMode = BlockMode;

type ReporterOnStartOptions = {
  estimatedTime: number;
  showStatus: boolean;
};

export interface Reporter {
  readonly onTestResult?: (
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult,
  ) => Promise<void> | void;
  readonly onTestFileResult?: (
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult,
  ) => Promise<void> | void;
  /**
   * Called before running a spec (prior to `before` hooks)
   * Not called for `skipped` and `todo` specs
   */
  readonly onTestCaseStart?: (
    test: Test,
    testCaseStartInfo: TestCaseStartInfo,
  ) => Promise<void> | void;
  readonly onTestCaseResult?: (
    test: Test,
    testCaseResult: TestCaseResult,
  ) => Promise<void> | void;
  readonly onRunStart: (
    results: AggregatedResult,
    options: ReporterOnStartOptions,
  ) => Promise<void> | void;
  readonly onTestStart?: (test: Test) => Promise<void> | void;
  readonly onTestFileStart?: (test: Test) => Promise<void> | void;
  readonly onRunComplete: (
    testContexts: Set<TestContext>,
    results: AggregatedResult,
  ) => Promise<void> | void;
  readonly getLastError: () => Error | void;
}



/**
  export interface IJestReporterInterlope {
    readonly onTestResult?: (
      test: Test,
      testResult: TestResult,
      aggregatedResult: AggregatedResult,
    ) => Promise<void> | void;
    readonly onTestFileResult?: (
      test: Test,
      testResult: TestResult,
      aggregatedResult: AggregatedResult,
    ) => Promise<void> | void;

    * Called before running a spec (prior to `before` hooks)
    * Not called for `skipped` and `todo` specs

    readonly onTestCaseStart?: (
      test: Test,
      testCaseStartInfo: TestCaseStartInfo,
    ) => Promise<void> | void;
    readonly onTestCaseResult?: (
      test: Test,
      testCaseResult: TestCaseResult,
    ) => Promise<void> | void;
    readonly onRunStart: (
      results: AggregatedResult,
      options: ReporterOnStartOptions,
    ) => Promise<void> | void;
    readonly onTestStart?: (test: Test) => Promise<void> | void;
    readonly onTestFileStart?: (test: Test) => Promise<void> | void;
    readonly onRunComplete: (
      testContexts: Set<TestContext>,
      results: AggregatedResult,
    ) => Promise<void> | void;
    readonly getLastError: () => Error | void;
  }

*/
