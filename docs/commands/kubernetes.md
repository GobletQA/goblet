# Commands - Kubernetes 

## General
* List all contexts
  * `kubectl config get-contexts`
* List all namespaces for the current context
  * `kubectl get ns`
* List all deployed services
  * `kubectl get svc`
* List all configured ingress
  * `kubectl get ingress`
* List all resource for all namespaces
  * `kubectl get all --all-namespaces`


## Production
* Set both context and namespace for an environment
  * `pnpm kube set <environment>` - environment should be one of `local`, `production`, etc...
* Set just the namespace
  * `kubectl config set-context --current --namespace=gb-production` - Namespace is set as the default
  * `devspace use namespace gb-production` - should be done automatically via devspace
* Set just the context
  * `devspace use context lke70246-ctx` - should be done automatically via devspace
  * `kubectl config set-context lke70246-ctx`
* Deploy to production kubernetes
  * `pnpm dev deploy --env prod --log --skip fe`
  * **IMPORTANT** - Don't forget to add `--env prod` to ensure you are using the correct environment
* Curl cmds to test Backend API
  * `curl -kivL -H 'Host: backend.dev.gobletqa.app' -H 'Origin: localhost' 'http://198.58.121.252'`
* See the ingress-nginx, and get the IP address of it
  * `kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`
