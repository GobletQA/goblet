# Tasks - Kube
* Requires [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/) and [helm](https://helm.sh/docs/intro/install/)
* Runs tasks that shell out to the either the `kubectl` or `helm` executable
* Expects a `<root-dir>/container` folder that contains the helm `values.yaml` files and charts
  * Can be overridden

## Kube

* Cmd: `pnpm kube <sub-tasks> <options>`
* Alias: `kubectl`, `kb`, `kcl`
* Description: Run tasks related to kubernetes and helm
* Example `pnpm kube ingress`

### Auth

* Cmd: `pnpm kube auth  <options>`
* Description: Create `docker-auth` secrets used by the Backend API, calls the `secret` task internally
* Example `pnpm kube auth`


### Secret

* Cmd: `pnpm kube secret <options>`
* Description: Create kubernetes secrets for the environment
* Example `pnpm kube secret --name my-secret --key my-key --value my-value`


### Ingress

* Cmd: `pnpm kube ingress <options>`
* Description: Create an new `nginx ingress` for the current kubernetes namespace via `helm chart`
* Example `pnpm kube ingress`
