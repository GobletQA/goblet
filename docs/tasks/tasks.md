# Tasks

* Custom tasks used to manage the GobletQA monorepo


## Devsapce

* Cmd: `yarn devspace <sub-task> <options>`
* Alias: `kubectl`, `kb`, `kcl`
* Description: Run tasks related to devspace
* Example `yarn dev start`

### Start

* Cmd: `yarn dev start <options>`
* Alias: `st`
* Description: Runs the dev environment by default using devspace to deploy helm charts
* Example `yarn dev start`

## Kube

* Cmd: `yarn kube <sub-tasks> <options>`
* Alias: `kubectl`, `kb`, `kcl`
* Description: Run tasks related to kubernetes and helm
* Example `yarn kube ingress`

### Auth

* Cmd: `yarn kube auth  <options>`
* Description: Create `docker-auth` secrets used by the Backend API, calls the `secret` task internally
* Example `yarn kube auth`


### Secret

* Cmd: `yarn kube secret <options>`
* Description: Create kubernetes secrets for the environment
* Example `yarn kube secret --name my-secret --key my-key --value my-value`


### Ingress

* Cmd: `yarn kube ingress <options>`
* Description: Create an new `nginx ingress` for the current kubernetes namespace via `helm chart`
* Example `yarn kube ingress`
