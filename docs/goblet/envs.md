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
    * This gets set, then removed in `shared/repo/getClientWorld.ts`
  * **Repos** - `workflows`, `latent`, `shared`


* `GOBLET_TESTS_RESULT`
  * **Description** - The outcome of a test execution. Will be either `pass` or `fail`
    * This value is always set after **one** or **more** tests are run by `Exam`
    * Value is reset for the environment right before test execution
    * If no tests have been run, the value will be `undefined`
  **Repos** - `exam`, `test-utils`


* `GB_REPO_NO_SECRETS`
  * **Description** - Disables loading secrets when not enabled for a repo
  * **Repos** - `exam`, `test-utils`, `workflows`



## UI Only

* `GOBLET_RUN_FROM_UI`
  * **Description** - Defines how the `browser` repo should manage playwright browsers
    * Automatically set when tests are run from the browser UI
  * **Repos** - `browser`, `shared`, `test-utils`


## CI Only

* `GOBLET_RUN_FROM_CI`
  * **Description** - Defines how the `browser` repo should manage playwright browsers
    * Automatically set when tests are run from the browser UI
  * **Repos** - `browser`, `shared`, `test-utils`

* `GOBLET_TOKEN`
  * **Description** - Repo specific token for encrypting and decrypting secrets
    * Should be kept secret
    * Share only with those who should have access to the content of the secrets files
  * **Repos** - `latent`


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