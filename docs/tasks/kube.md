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

**Docker Auth**
* Cmd: `pnpm kube secret auth <options>`
* Description: Create kubernetes docker auth secret used by the Backend API, calls the `secret` task internally
* Example `pnpm kube secret auth`
* Sets the name of the secret to the value of the `GB_KUBE_SCRT_DOC_AUTH` env (default: `docker-auth`).

**Firebase Service Account**
* Cmd: `pnpm kube secret fbsa <options>`
* Description: Create kubernetes firebase service account secret used by the Backend API, calls the `secret` task internally
* Example `pnpm kube fbsa`
* Sets the name of the secret to the value of the `GB_KUBE_SCRT_FB_SA` env (default: `firebase-sa`).
* Dev example: `pnpm kube secret firebase --file ~/.kegConfig/goblet/goblet-dev-firebase-sa.json --log`

**Goblet Latent Token**
* Cmd: `pnpm kube secret goblet`
* Description: Create goblet token secret used by the Latent, calls the `secret` task internally
* Example `pnpm kube secret goblet`
* Sets the name of the secret to the value of the `GB_LT_TOKEN_SECRET` env (default: `goblet-token`).
* Dev example: `pnpm kube secret goblet --log`

