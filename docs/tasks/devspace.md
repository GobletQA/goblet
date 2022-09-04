# Tasks - Devspace
* Requires [devspace](https://devspace.sh/docs/getting-started/introduction)
* Runs tasks that shell out to the `devspace` executable
* Expects a `<root-dir>/container` folder that contains the `devspace.yaml` file
  * This can be overridden

## Devspace

* Cmd: `yarn devspace <sub-task> <options>`
* Alias: `kubectl`, `kb`, `kcl`
* Description: Run tasks related to devspace
* Example `yarn dev start`

### Start

* Cmd: `yarn dev start <options>`
* Alias: `st`
* Description: Runs the dev environment by default using devspace to deploy helm charts
* Example `yarn dev start`