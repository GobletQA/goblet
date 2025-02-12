
export const options = {
  /**
   * Glob pattern of test files to match against and run
   * Can be a directory path or file path
   * Any matching test files with paths that match will be executed
   */
  testMatch: {
    type: `array`,
    alias: [`tests`, `test`, `tm`, `t`],
    description: `List of files that will be run by the exam test executor`
  },

  /**
   * Root directory for the test execution
   * All relative paths will be relative to this directory unless `testDir` is defined
   */
  rootDir: {
    alias: [`root`, `rd`],
    description: `Root directory the exam test executor will be run from`
  },
  /**
   * If defined only tests within this directory will be loaded
   * If `testMatch` is defined, it is still applied to tests within this directory
   * Support files `Runner`, `Transform`, or `Environment` are still relative to the rootDir
   * This only effects `test` files
   */
  testDir: {
    alias: [`td`],
    description: `Test directory the exam test executor will be run from`
  },

  /**
   * Glob pattern of test files to ignore even in found from the testMatch options
   * Can be a directory path or file path relative to the rootDir
   * Any matching test files with paths that match will be ignored
   */
  testIgnore: {
    type: `array`,
    alias: [`exclude`, `exc`, `skip`, `ignore`, `ti`],
    description: `Blacklist of files or folders to NOT include in the test run`
  },

  /**
   * Number of times to retry a test when it fails
   */
  testRetry: {
    alias: [`tr`, `retry`],
    description: `Number of times to retry a test when it fails`,
  },

  /**
   * Number of times to retry a test suite when a test in the suite fails
   */
  suiteRetry: {
    alias: [`sr`, `sretry`],
    description: `Number of times to retry a test suite when a test in the suite fails`,
  },

  /**
   * Glob pattern of test files to ignore by transforms
   * Each items must be a file path relative to the rootDir
   * Any matching test files with paths that match will be ignored
   */
  transformIgnore: {
    type: `array`,
    alias: [`tri`],
    description: `Blacklist of files ignored by transforms`
  },

  /**
   * Glob paths of files the loader will ignore
   */
  loaderIgnore:{
    type: `array`,
    alias: [ `li`, `ldi`],
    description: `Blacklist of files ignored by the file loader. Files will be completely ignored`
  },

  /**
   * Mode to run the tests one of serial or parallel, override serial and parallel options
   */
  mode: {
    type: `string`,
    alias: [`md`],
    allowed: [`serial`, `parallel`],
    description: `Sets how tests will be executed within a worker. Either serial or parallel`
  },

  /**
   * Run the tests in serial mode, overrides parallel option, and is overridden by mode option
   */
  serial: {
    type: `boolean`,
    alias: [`series`, `ordered`, `sync`, `srl`],
    description: `Each worker will execute one test at a time. Same as setting "mode" to "serial"`
  },

  /**
   * Run the tests in parallel mode, and is overridden by mode and serial options
   */
  parallel: {
    type: `boolean`,
    alias: [`async`, `prl`],
    description: ` Each job can execute multiple tests at a time based on worker concurrency. Same as setting "mode" to "parallel"`
  },

  /**
   * Debug logging output
   */
  debug: {
    type: `boolean`,
    alias: [`dev`],
    description: `Enables debug logging durning text execution`
  },

  /**
   * Verbose logging output
   */
  verbose: {
    type: `boolean`,
    alias: [`ver`, `v`],
    description: `Enables verbose logging durning text execution`
  },

  /**
   * Timeout per test
   */
  testTimeout: {
    alias: [`ttimeout`, `tt`, `timeout`],
    description: `Timeout for each individual test in milliseconds`
  },

  /**
   * Timeout pre suite (i.e. per file)
   */
  suiteTimeout: {
    alias: [`st`, `stimeout`],
    description: `Suite timeout for each test file in milliseconds`
  },

  /**
   * Default extensions loaded by the Exam Loader class
   */
  extensions: {
    type: `array`,
    alias: [`ex`, `ext`, `exs`, `exts`],
    description: `Array of file extensions of files that search for and loaded`,
    default: [
      `.js`,
      `.jsx`,
      `.cjs`,
      `.mjs`,
      `.ts`,
      `.cts`,
      `.mts`,
      `.tsx`,
    ],
  },

  /**
   * List of files to run before the Runner has executed
   */
  preRunner:{
    type: `array`,
    alias: [`prr`],
    description: `List of paths to script to be executed before the test runner executes`,
  },

  /**
   * List of files to run after the Runner has executed
   */
  postRunner:{
    type: `array`,
    alias: [`ptr`],
    description: `List of paths to script to be executed after the test runner executes`,
  },

  /**
   * Reuse the same runner class instance to the same file types
   */
  reuseRunner: {
    type: `boolean`,
    alias: [`rr`],
    description: `Reuse the same runner class instance to the same file types`,
  },

  /**
   * Custom options to pass to the environment. Gets set to environment.options
   */
  environment: {
    description: `Path to an custom environment file. Must export a Environment class as default`
  },

  /**
   * List of files to run before the environment as been setup
   */
  preEnvironment:{
    type: `array`,
    alias: [`pre`],
    description: `List of paths to script to be executed before the test environment is setup`,
  },

  /**
   * List of files to run after the environment as been setup
   */
  postEnvironment:{
    type: `array`,
    alias: [`pte`],
    description: `List of paths to script to be executed after the test environment is setup`,
  },

  /**
   * Custom Reporters for reporting test execution results
   */
  reporters: {
    type:`array`,
    description: `Comma separated list of paths to custom Reporter class files. File must export a Reporter class as default. Can also specify one of "default" | "silent"`
  },

  /**
   * List of files to run after the environment as been setup
   */
  passWithNoTests:{
    type: `boolean`,
    alias: [`pass`],
    description: `Allows the tests to pass when no files are found or tests are executed.`,
  },

  /**
   * Enable or disable file caching in the Loader. Defaults to true. Disable the cache using --no-cache
   */
  cache: {
    default: true,
    type: `boolean`,
    description: `Use file caching when loading files. To disable caching use "--no-cache"`
  },

  /**
   * Exit the test suite immediately upon n number of failing test suite. Defaults to 1
   */
  bail:{
    description: `Exit the test suite immediately upon n number of failing test suite`,
  },

  /**
   * The amount of test that can be executed at the same time
   * Should be based on the available resources of the host machine
   */
  concurrency: {
    alias: [`concur`, `cc`],
    description: `The amount of test that can be executed at the same time per worker. Ignored when runInBand is true`
  },

  /**
   * The amount of workers that will be created to run tests
   * Should be based on the available resources of the host machine
   */
  workers: {
    alias: [`w`],
    description: `The number of workers to be created to run tests. Ignored when runInBand is true`
  },

  /**
   * Makes the tests run very slow. Basically runs one test at a time in a single worker
   * Added here to match other test framework CLI's
   */
  runInBand: {
    type: `boolean`,
    alias: [`single`, `shared`],
    description: `Run all tests serially, using just a single shared worker`
  },

  /**
   * Should the test output include color in the terminal
   */
  colors: {
    default: true,
    type: `boolean`,
    description: `Forces test results output highlighting even if stdout is not a TTY`
  },

  /**
   * The Log Level to use durning text execution
   * Must be one of `error` | `warn` | `info` | `http` | `verbose` | `debug` | `silly`
   */
  logLevel: {
    default: `info`,
    alias: [`log`, `level`, `ll`],
    description: `The log level to use durning test execution`,
    allowed: [`error`,`warn`,`info`,`http`,`verbose`,`debug`,`silly`],
  },

  exitOnFailed: {
    default: false,
    type: `boolean`,
    alias: [`eof`, `exit`],
    example: `--exitOnFailed`,
    description: `Stop running test and exit the process is a test fails`,
  },

  skipAfterFailed: {
    default: true,
    type: `boolean`,
    alias: [`saf`, `skip`],
    example: `--skipAfterFailed`,
    description: `When a test fails, skip all future tests within in the same suite`,
  },

  /**
   * The node environment the tests should be run in
   * Same as setting the NODE_ENV=<environment>
   */
  env: {
    default: `test`,
    env: `NODE_ENV`,
    alias: [`environment`],
    description: `The test environment used for all tests`
  },

  /**
   * Path to an Exam config file relative to the rootDir
   * Or current working directory if rootDir is undefined
   */
  config: {
    alias: [ `cfg`, `c`],
    example:`--config ./exam.ts`,
    description: `Path to a config file. Default export must be a valid config or function that returns one`,
  },



  /**
   * **IMPORTANT**
   * These are added just the options response will be a valid Exam Config object
   * But they can not currently be set from the command line
   * To use them, an exam config file **MUST** be used
   */

  /**
   * Items to add as environment variables within the environment
   * Gets set to `process.env` object
   */
  envs: {
    type: `object`,
  },

  /**
   * Items to add to the global scope of the environment
   */
  globals: {
    type: `object`,
  },

  /**
   * Esbuild configuration passed to esbuild
   * See here for more info https://github.com/egoist/esbuild-register
   */
  esbuild: {
    type: `object`,
  },

  /**
   * Custom Runners to execute tests, based on file extension
   */
  runners: {
    type: `object`,
  },

  /**
   * Custom File transform loaded before Runner, based on file extension
   */
  transforms: {
    type: `object`,
  },

  /**
   * Callback to listen for events fired during test execution
   * onEvent: () => {},
   */

  /**
   * Callback to called when test execution is canceled
   * onCancel: () => {},
   */

  /**
   * Callback to called when exam has finished cleaning up after a test run
   * onCleanup: () => {},
   */



  /**
   *
   * ----- **IMPORTANT** The below options have not yet been implemented -----
   *
   */


  /**
   * Hides all output to the terminal
   * Helpful if only the reporters should collect test results, and nothing else
   */
  silent: {
    type: `boolean`,
    description: `Prevent logging output to command line`
  },

}
