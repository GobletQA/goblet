# Tasks - Kube
* Requires [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/) and [helm](https://helm.sh/docs/intro/install/)
* Runs tasks that shell out to the either the `kubectl` or `helm` executable
* Expects a `<root-dir>/container` folder that contains the helm `values.yaml` files and charts
  * Can be overridden

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
