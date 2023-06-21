# Secrets and Values

* Secrets and Values are stored with repo on git provider
* Values are just regular ENV files, with Key value pairs
* Secrets are encrypted files
  * Encrypted on a per-repo bases
  * Access to the repo is the same as access to the secrets


## Values

* Are stored in plain text
* Follow the `.env` format of `Key=Value`
* Should follow naming pattern matching the environment they belong to
* Example:
  * `NODE_ENV` === `develop` => `values.develop.env`
  * `NODE_ENV` === `production` => `values.production.env`

### Loading / Unloading

* Are loaded on execution of a tests
  * The envs to be loaded are passed on the currently configured environment
* Are unloaded when test execution finish

## Secrets

* Are stored as encrypted files
* Follow the `.env` format of `Key=Value`
* Should follow naming pattern matching the environment they belong to
* Example:
  * `NODE_ENV` === `develop` => `secrets.develop.env`
  * `NODE_ENV` === `production` => `secrets.production.env`




