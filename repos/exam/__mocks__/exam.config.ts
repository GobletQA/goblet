import { TExamConfig } from '@GEX/types'
import { ExamEvents } from '@GEX/Events'

export const ExamConfig:TExamConfig = {

  /**
   * Root directory for the test execution
   * All relative paths will be relative to this directory unless `testDir` is defined
   */
  rootDir: undefined,

  /**
   * If defined only tests within this directory will be loaded
   * If `testMatch` is defined, it is still applied to tests within this directory
   * Support files `Runner`, `Transform`, or `Environment` are still relative to the rootDir
   * This only effects `test` files
   */
  testDir: undefined,

  /**
   * Glob pattern of test files to match against and run
   * Can be a directory path or file path
   * Any matching test files with paths that match will be executed
   */
  testMatch: [],

  /**
   * Glob pattern of test files to ignore even in found from the testMatch options
   * Can be a directory path or file path
   * Any matching test files with paths that match will be ignored
   */
  testIgnore: [],

  /**
   * Glob paths of files the transforms will ignore
   */
  transformIgnore: [],

  /**
   * Glob paths of files the loader will ignore
   */
  loaderIgnore:[],

  /**
   * Esbuild configuration passed to esbuild
   * See here for more info https://github.com/egoist/esbuild-register
   */
  esbuild: {},

  /**
   * Debug logging output
   */
  debug: false,

  /**
   * Verbose logging output
   */
  verbose: false,

  /**
   * Timeout per test - 30 seconds (default)
   */
  timeout: 0,

  /**
   * Global timeout for test run per file - 20min (default)
   */
  globalTimeout: 0,

  /**
   * Custom events that a custom `Runner`, `Transform`, or `Environment` will fire
   */
  events: ExamEvents,

  /**
   * Callback to listen for events fired during test execution
   */
  onEvent: () => {},
  
  /**
   * Callback to called when test execution is canceled
   */
  onCancel: () => {},
  
  /**
   * Callback to called when exam has finished cleaning up after a test run
   */
  onCleanup: () => {},

  /**
   * Default extensions loaded by the Exam Loader class
   */
  extensions: [
    `.js`,
    `.jsx`,
    `.cjs`,
    `.mjs`,
    `.ts`,
    `.cts`,
    `.mts`,
    `.tsx`,
  ],
  
  /**
   * Custom Runners to execute tests, based on file extension
   */
  runners: {
    
  },
  /**
   * Custom File transform loaded before Runner, based on file extension
   */
  transforms: {
    
  },
  /**
   * Custom Environment loaded before Transform and Runner, based on file extension
   */
  environment: undefined,

  /**
   * Custom Reporters for reporting test execution results
   */
  reporters: [`default`],

  /**
   * List of files to run before the Runner has executed
   */
  preRunner:[
    `__mocks__/preRunner.ts`,
  ],

  /**
   * List of files to run after the Runner has executed
   */
  postRunner:[
    `__mocks__/postRunner.ts`,
  ],

  /**
   * List of files to run before the environment as been setup
   */
  preEnvironment:[
    `__mocks__/preEnvironment.ts`,
  ],


  /**
   * List of files to run after the environment as been setup
   */
  postEnvironment:[
    `__mocks__/postEnvironment.ts`,
  ],


  /**
   * Items to add as environment variables within the environment
   * Gets set to `process.env` object
   */
  envs: {},

  /**
   * Items to add to the global scope of the environment
   */
  globals: {},

  /**
   * Use module caching in the Loader, This is a runtime cache only
   */
  cache: true,

  /**
   * If no test files are found, an error is thrown, setting this true will disable that
   */
  passWithNoTests: false,

  /**
   * Custom reporter config options
   */
  reporter: {},


  /**
   * ----- TODO: Need to implement these ----- *
   */

  /**
   * Retry a test when it fails
   */
  testRetry:0,

  /**
   * Retry an entire test suite when any test in the suite fails
   */
  suiteRetry:0,

  /**
   * Exit the test suite immediately upon n number of failing test suite. Defaults to 0
   */
  bail: 0,

  /**
   * The number of workers to be created to run tests. Ignored when runInBand option is true
   */
  workers: 1,

  /**
   * The amount of test that can be executed per worker. Ignored when runInBand option is true
   */
  concurrency: 1,

  colors: true,
  silent: false,
  runInBand: false,

}

export default ExamConfig