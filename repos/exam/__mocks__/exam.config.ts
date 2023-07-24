

export const ExamConfig = {

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
  testMatch: undefined,

  /**
   * Glob pattern of test files to ignore even in found from the testMatch options
   * Can be a directory path or file path
   * Any matching test files with paths that match will be ignored
   */
  testIgnore: undefined,
  
  /**
   * Custom events that a custom `Runner`, `Transform`, or `Environment` will fire
   */
  events: {},

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
  
  execute: {
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
    timeout: 30000,

    /**
     * Global timeout for test run per file - 20min (default)
     */
    globalTimeout: 60000 * 20,
    
    /**
     * Any other custom key value passed on to a custom Runner, Transform, or Environment
     */
    key: `value`
  },

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
  environments: {
    
  },

  /**
   * Custom Reporters for reporting test execution results
   */
  reporters: []
  
}