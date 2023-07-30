# Exam CLI Options

## CLI and Config Options

### `testMatch`
Glob pattern of test files to match against and run. Can be a directory path or file path. Any matching test files with paths that match will be executed.

- **Type:** `array`
- **Alias:** `tests`, `test`, `tm`, `t`
- **Description:** List of files that will be run by the exam test executor

### `rootDir`
Root directory for the test execution. All relative paths will be relative to this directory unless `testDir` is defined.

- **Alias:** `root`, `rd`
- **Description:** Root directory the exam test executor will be run from

### `testDir`
If defined, only tests within this directory will be loaded. If `testMatch` is defined, it is still applied to tests within this directory. Support files `Runner`, `Transform`, or `Environment` are still relative to the rootDir. This only affects `test` files.

- **Alias:** `td`
- **Description:** Test directory the exam test executor will be run from

### `testIgnore`
Glob pattern of test files to ignore even if found from the `testMatch` options. Can be a directory path or file path relative to the `rootDir`. Any matching test files with paths that match will be ignored.

- **Type:** `array`
- **Alias:** `exclude`, `exc`, `skip`, `ignore`, `ti`
- **Description:** Blacklist of files or folders to NOT include in the test run

### `transformIgnore`
Glob pattern of test files to ignore by transforms. Each item must be a file path relative to the `rootDir`. Any matching test files with paths that match will be ignored.

- **Type:** `array`
- **Alias:** `tri`
- **Description:** Blacklist of files ignored by transforms

### `loaderIgnore`
Glob paths of files the loader will ignore.

- **Type:** `array`
- **Alias:** `li`, `ldi`
- **Description:** Blacklist of files ignored by the file loader. Files will be completely ignored

### `mode`
Mode to run the tests, one of serial or parallel, overrides `serial` and `parallel` options.

- **Type:** `string`
- **Alias:** `md`
- **Allowed Values:** `serial`, `parallel`
- **Description:** Sets how tests will be executed within a worker. Either serial or parallel

### `serial`
Run the tests in serial mode, overrides `parallel` option, and is overridden by the `mode` option. Each worker will execute one test at a time. Same as setting "mode" to "serial".

- **Type:** `boolean`
- **Alias:** `series`, `ordered`, `sync`
- **Description:** Each worker will execute one test at a time. Same as setting "mode" to "serial"

### `parallel`
Run the tests in parallel mode, and is overridden by `mode` and `serial` options. Each job can execute multiple tests at a time based on worker concurrency. Same as setting "mode" to "parallel".

- **Type:** `boolean`
- **Alias:** `async`
- **Description:** Each job can execute multiple tests at a time based on worker concurrency. Same as setting "mode" to "parallel"

### `debug`
Debug logging output. Enables debug logging during test execution.

- **Type:** `boolean`
- **Alias:** `dev`
- **Description:** Enables debug logging during test execution

### `verbose`
Verbose logging output. Enables verbose logging during test execution.

- **Type:** `boolean`
- **Alias:** `ver`, `v`
- **Description:** Enables verbose logging during test execution

### `timeout`
Timeout per test - 30 seconds (default).

- **Type:** `number`
- **Alias:** `time`, `to`
- **Description:** Timeout for each individual test - 30 seconds (default)

### `globalTimeout`
Global timeout for test run per file - 20 minutes (default).

- **Type:** `number`
- **Alias:** `gt`, `time`, `to`
- **Description:** Global timeout for each test file - 20 minutes (default)

### `extensions`
Default extensions loaded by the Exam Loader class. Array of file extensions of files that search for and load.

- **Type:** `array`
- **Alias:** `ex`, `ext`, `exs`, `exts`
- **Description:** Array of file extensions of files that search for and loaded
- **Default Value:**
  ```
  [
    .js,
    .jsx,
    .cjs,
    .mjs,
    .ts,
    .cts,
    .mts,
    .tsx,
  ]
  ```

### `preRunner`
List of files to run before the Runner has executed.

- **Type:** `array`
- **Alias:** `prr`
- **Description:** List of paths to script to be executed before the test runner executes

### `postRunner`
List of files to run after the Runner has executed.

- **Type:** `array`
- **Alias:** `ptr`
- **Description:** List of paths to script to be executed after the test runner executes

### `environment`
Custom options to pass to the environment. Gets set to `environment.options`.

- **Description:** Path to a custom environment file. Must export an Environment class as default

### `preEnvironment`
List of files to run before the environment has been set up.

- **Type:** `array`
- **Alias:** `pre`
- **Description:** List of paths to script to be executed before the test environment is set up

### `postEnvironment`
List of files to run after the environment has been set up.

- **Type:** `array`
- **Alias:** `pte`
- **Description:** List of paths to script to be executed after the test environment is set up

### `reporters`
Custom Reporters for reporting test execution results. Comma-separated list of paths to custom Reporter class files. File must export a Reporter class as default. Can also specify one of "default" | "silent".

- **Type:** `array`
- **Description:** Comma-separated list of paths to custom Reporter class files. File must export a Reporter class as default. Can also specify one of "default" | "silent"

### `passWithNoTests`
Allows the tests to pass when no files are found or tests are executed. Defaults to `false`.

- **Type:** `boolean`
- **Alias:** `pass`
- **Default Value:** `false`
- **Description:** Allows the tests to pass when no files are found or tests are executed.

### `cache`
Enable or disable file caching in the Loader. Defaults to `true`. Disable the cache using `--no-cache`.

- **Type:** `boolean`
- **Default Value:** `true`
- **Description:** Use file caching when loading files. To disable caching use "--no-cache"

### `bail`
Exit the test suite immediately upon n number of failing test suites. Defaults to `0`.

- **Type:** `number`
- **Description:** Exit the test suite immediately upon n number of failing test suites

### `concurrency`
The amount of test

 that can be executed at the same time per worker. Should be based on the available resources of the host machine. Ignored when `runInBand` is true.

- **Type:** `number`
- **Alias:** `concur`, `cc`
- **Description:** The amount of test that can be executed at the same time per worker. Ignored when runInBand is true

### `workers`
The number of workers to be created to run tests. Should be based on the available resources of the host machine. Ignored when `runInBand` is true.

- **Type:** `number`
- **Alias:** `w`
- **Description:** The number of workers to be created to run tests. Ignored when runInBand is true

### `env`
The node environment the tests should be run in. Same as setting the `NODE_ENV=<environment>`.

- **Type:** `string`
- **Alias:** `environment`
- **Default Value:** `test`
- **Description:** The test environment used for all tests


### `runInBand`
Makes the tests run very slow. Basically runs one test at a time in a single worker. Added here to match other test framework CLI's.

- **Type:** `boolean`
- **Alias:** `single`, `shared`
- **Default Value:** `false`
- **Description:** Run all tests serially, using just a single shared worker

### `colors`
Should the test output include color in the terminal.

- **Type:** `boolean`
- **Default Value:** `true`
- **Description:** Forces test results output highlighting even if stdout is not a TTY

### `config`
Path to an Exam config file relative to the `rootDir`, or the current working directory if `rootDir` is undefined. Example: `--config ./exam.ts`.

- **Alias:** `cfg`, `c`
- **Example:** `--config ./exam.ts`
- **Description:** Path to a config file. Default export must be a valid config or function that returns one


## Config Options **ONLY**

### `envs`
Items to add as environment variables within the environment. Gets set to `process.env` object.

- **Type:** `object`

### `globals`
Items to add to the global scope of the environment.

- **Type:** `object`

### `esbuild`
Esbuild configuration passed to esbuild. See [here](https://github.com/egoist/esbuild-register) for more info.

- **Type:** `object`

### `events`
Custom events that a custom `Runner`, `Transform`, or `Environment` will fire.

- **Type:** `object`

### `runners`
Custom Runners to execute tests, based on file extension.

- **Type:** `object`

### `transforms`
Custom File transform loaded before Runner, based on file extension.

- **Type:** `object`

### `onEvent`
Callback to listen for events fired during test execution.

### `onCancel`
Callback to be called when test execution is canceled.

### `onCleanup`
Callback to be called when the exam has finished cleaning up after a test run.


## Not Implemented

> **IMPORTANT**: The below options have not been implemented, but are planned for future iterations.
> * They can **NOT** currently be set from the command line.
> * To use them, an exam config file **MUST** be used.


### `silent`
Hides all output to the terminal. Helpful if only the reporters should collect test results, and nothing else.

- **Type:** `boolean`
- **Default Value:** `false`
- **Description:** Prevent logging output to the command line


### `testRetry`
Number of times to retry a test when it fails.

- **Type:** `number`
- **Alias:** `tr`
- **Default Value:** `0`
- **Description:** Number of times to retry a test when it fails

### `suiteRetry`
Number of times to retry a test suite when a test in the suite fails.

- **Type:** `number`
- **Alias:** `sr`
- **Default Value:** `0`
- **Description:** Number of times to retry a test suite when a test in the suite fails



## Workers vs Concurrency vs Mode

### Workers

* The workers options defines the amount of sub-process the are created when exam starts
* Each sub-process runs independently of the others, within it's own independent environment
  * There are a few globally scoped values that are consistent between workers
  * It's important to note, that these values are copies and do **NOT** share the same reference in memory
* Typically the number of workers should be **1 less then the amount of CPU cores** of the host machine
  * This assumes no other processes are running
  * If the `workers` option is not set, **This value will be set automatically**

### Concurrency

* Concurrency is the amount of jobs that a worker will pull from the queue one time.
* For example, if the `concurrency` option is set to `3`, then each worker will pull `3` jobs at a time
* Typically the `concurrency` should be set to `1` unless there is good reason not to
  * If the `concurrency` option is not set, **This value will be set automatically**

### Mode

* Mode defines how a `worker` should execute jobs, which is directly tied its `concurrency`
* It can be set to one of two options `serial` or `parallel`

**Serial**

* Each job within a worker will be executed **1 at a time**
* For example, if `mode` is `serial` and `concurrency` is set to `3`
  * The `worker` will process the each job **1 at a time** until all 3 `jobs` are finished
  * It will then look at the `queue` for more `jobs`
  * If `jobs` are available, the worker will pull 3 more from the `queue`
  * This continues until the queue is empty

**Parallel**
* Each job within a worker will be executed **at the same time**
* For example, if `mode` is `parallel` and `concurrency` is set to `3`
  * The `worker` will process the each job **at the same time**, in parallel
  * It will then look at the `queue` for more `jobs`
  * If `jobs` are available, the worker will pull 3 more from the `queue`
  * This continues until the queue is empty

* For each worker
  * create a browser that is reused per job executed by the worker
  * reset the browser on each invocation of the a job, before the job is run
