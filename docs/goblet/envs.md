# Goblet Envs


## All Environments

* `GOBLET_ENV`
  * **Description** - The current environment goblet is running in for a specific repo
    * Sets which `values` and `secrets` files will be loaded during test execution
  * **Repos** - `ALL`

* `GOBLET_CONFIG_BASE`
  * **Description** - Base directory of where the mounted repos `goblet.config` can be found
  * **Repos** - `ALL`

* `GB_GIT_REPO_REMOTE`
  * **Description** - The remote url of the currently mounted repo
    * Speeds up loading the token when loading secrets
    * This gets set, then removed in `repos/repo/world/getClientWorld.ts`
  * **Repos** - `workflows`, `latent`, `shared`


* `GOBLET_TESTS_RESULT`
  * **Description** - The outcome of a test execution. Will be either `pass` or `fail`
    * This value is always set after **one** or **more** tests are run by `Exam`
    * Value is reset for the environment right before test execution
    * If no tests have been run, the value will be `undefined`
  **Repos** - `exam`, `testify`


* `GB_REPO_NO_SECRETS`
  * **Description** - Disables loading secrets when not enabled for a repo
  * **Repos** - `exam`, `testify`, `workflows`

* `GB_VNC_VIEW_HEIGHT`
  * **Default** - 1430
  * **Description** - Disables loading secrets when not enabled for a repo
  * **Repos** - `screencast`, `browser`, `frontend`

* `GB_VNC_VIEW_WIDTH`
  * **Default** -  1615
  * **Description** - Disables loading secrets when not enabled for a repo
  * **Repos** - `screencast`, `browser`, `frontend`


## UI Only

* `GOBLET_RUN_FROM_UI`
  * **Description** - Defines how the `browser` repo should manage playwright browsers
    * Automatically set when tests are run from the browser UI
  * **Repos** - `browser`, `shared`, `testify`

* `GB_EXAM_UI_CONFIG_STR`
  * **Description** - Stringified version of an exam config object
    * Used for passing config options from the UI to the exam when running the entire test suite
    * exam config passed from UI gets stringified and set as a this ENV
    * Then is converted back into an Object when building `exam.config` in the child process
    * Because of this, non-stringifiable items can not be included. I.E. `functions`
  * **Repos** - `testify`


## CI Only

* `GOBLET_RUN_FROM_CI`
  * **Description** - Defines how the `browser` repo should manage playwright browsers
    * Automatically set when tests are run from the browser UI
  * **Repos** - `browser`, `shared`, `testify`



## Repo Specific

### Latent

* `GB_LT_TOKEN_SECRET`
  * **Description** - Base Token for encrypting and decrypting repo tokens
    * Should never be shared
  * **Repos** - `latent`
* `GB_REPO_CONFIG_REF`
  * **Description** - Repo ref defined in a goblet config to use as a token alongside the `GB_LT_TOKEN_SECRET`
    * Can be public. Think of it as a public key
  * **Repos** - `latent`

### Logger

* `GB_LOGGER_FORCE_DISABLE_SAFE`
  * **Description** - Force disables the safe-replacer in the logger
    * If enabled all values including secrets will be logged
    * This should almost never be used
    * It exists allow the exam json reporter to log valid JSON to stdout
    * A better solution would be to update the safe-replacer to not break json logged to stdout
  * **Repos** - `logger`


### Testify

* `GOBLET_TOKEN`
  * **Description** - Repo specific token for encrypting and decrypting secrets
    * Should be kept secret
    * Share only with those who should have access to the content of the secrets files
    * Used to decrypt secrets when running exam
  * **Repos** - `latent`, `exam`


### Screencast

* `GB_SC_IDLE_DEBUG`
  * **Default** - `develop` = `true` / `production` = `false`
  * **Description** - Enable or disable debug logs session container idle state
    * Used for debugging the idle timeout / shutdown of the session-container
    * Used only in development. Is disabled in production
* `GB_SC_IDLE_TIMEOUT_ACTIVE`
  * **Default** - `develop` = `false` / `production` = `true`
  * **Description** - Enable or disable session timeout for the session container
    * When active and the session times out due to inactivity, the session container is shutdown
    * Used in production, is disabled in development by default
* `GB_SC_IDLE_INTERVAL`
  * **Default** - 20 seconds
  * **Description** - Interval in seconds that the idle timeout check will run
* `GB_SC_IDLE_WAIT_TO_START`
  * **Default** - 120 seconds
  * **Description** - Time in seconds to wait before starting the idle timeout check in seconds, i.e. 180 === 3min
* `GB_SC_IDLE_THRESHOLD`
  * **Default** - 4 seconds
  * **Description** - Number of times the inactive check can be true before shutting down the session container
* `GB_SC_IDLE_CONNECTION_THRESHOLD`
  * **Default** - 2 connections
  * **Description** - Max number of connections that can exist to consider the container to be idle
* `GB_SC_RESET_CONNECTION_FILE`
  * **Default** - `reset-connection-check`
  * **Description** - # Name of the file that gets created when the idle connections check should be reset
    * The idle timeout check script, looks for this file
    * If it exists, the file is removed, and the idle timeout is reset
    * This file is created by the frontend calling the screencast API endpoint `/screencast/reset/idle`
      * This call is made when the user selects continue when the `IdleCheck` modal is displayed


### Config

* `GB_IGNORE_MISSING_ALIAS`
  * **Default** - `undefined`
  * **Description** - Ignore errors for folder in `repos/*` that do not contain a tsconfig.json
    * Aliases are loaded from the paths property of a repos `tsconfig.json`
    * In development, it's helpful to display an error when the file is missing
    * In production, all code is bundled, and the alias are not used in the same way
    * So the error is not needed

