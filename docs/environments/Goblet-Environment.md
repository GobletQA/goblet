# Environments, Secrets and Values

* Environments are used as a way to group Secrets and Values
* Values are just regular ENV files, with Key value pairs
* Secrets are encrypted files
  * Encrypted on a per-repo bases
  * Access to the repo is the same as access to the secrets
* Secrets and Values are stored directly in the repository
  * This is why the secrets are store in encrypted files

## Environments

* Used to group which secrets and values will be loaded
* Is directly related to a prefix || postfix in the secrets or values files names
* Example:
  * `Environment` === `develop` => `values.develop.env` || `develop.values.env`
  * `Environment` === `production` => `values.production.env` || `production.values.env`
* From the goblet platform UI, it can be set dynamically
* In other environments like `CI/CD`, the environment should be set before test execution
  * This can be done by setting the `GOBLET_ENV` environment variable

### Pre-Defined Environments

* Currently Goblet uses the allows environments
  * `production`
  * `qa`
  * `test`
  * `staging`
  * `develop`
  * `local`

### Future release

* Custom environments maybe available in a future release as needed


## Values

* Are stored in plain text
* Follow the `.env` format of `Key=Value`
* Should follow naming pattern matching the environment they belong to
* Example:
  * `Environment` === `develop` => `values.develop.env`
  * `Environment` === `production` => `values.production.env`

## Secrets

* Are stored as encrypted files
* Follow the `.env` format of `Key=Value`
* Should follow naming pattern matching the environment they belong to
* Example:
  * `Environment` === `develop` => `secrets.develop.env`
  * `Environment` === `production` => `secrets.production.env`


## Loading / Unloading

* Both secrets and values are loaded when the session container is initialized based on the default environment
* If a secret of value is changed for the active environment
  * They will be unloaded then reloaded with the updates

### Future release

* Secrets are loaded on execution of a tests, then unloaded when test execution finish
* While not currently implemented, it's best to separate secrets and values because of this
  * That way when the functionality is added, no updates are required 

### Defaults

* Secrets defined in `secrets.env` will be loaded for all environments
* Values defined in `values.env` will be loaded for all environments
* If the current environments contains a `key` that matches a `key` from the defaults
  * The current environments value override the default value



## Process Flow
* User selects git repo to clone
* Workflows clones down repo
* Check is made for goblet config
  * Then a check is made for the `repoUrl` property in the goblet config
  * If it does not contain a repoUrl, add the current `remote` as the value
* Use Latent to generate a token with the `repoUrl` and the goblet-env salt
  * 