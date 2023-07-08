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


### Context / Namespace
* Ensure the correct context and namespace are set
* Local
  * Context:  `docker-desktop`
  * Namespace: `gb-local`
  * Cmd: `kubectl config set-context docker-desktop --namespace gb-local`
* Prod
  * Context:  `<*>`
  * Namespace: `gb-production`
  * Cmd: `kubectl config set-context --current --namespace gb-production`


### Auth

* Cmd: `pnpm kube secret auth  <options>`
* Description: Create kubernetes docker auth secret used by the Backend API, calls the `secret` task internally
* Example `pnpm kube secret auth`
* Sets the name of the secret to the value of the `GB_KUBE_SCRT_DOC_AUTH` env (default: `docker-auth`).


* Cmd: `pnpm kube secret fbsa  <options>`
* Description: Create kubernetes firebase service account secret used by the Backend API, calls the `secret` task internally
* Example `pnpm kube fbsa`
* Sets the name of the secret to the value of the `GB_KUBE_SCRT_FB_SA` env (default: `firebase-sa`).


### Secret

* Cmd: `pnpm kube secret <options>`
* Description: Create kubernetes secrets for the environment
* Example `pnpm kube secret --name my-secret --key my-key --value my-value`


### Ingress

* Cmd: `pnpm kube ingress <options>`
* Description: Create an new `nginx ingress` for the current kubernetes namespace via `helm chart`
* Example `pnpm kube ingress`
