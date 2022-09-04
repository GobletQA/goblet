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


## Cert-Manager - LetsEncrypt
* Kubernetes resource names
  * Issuer - `issuers.cert-manager.io`
  * Order - `orders.acme.cert-manager.io`
  * Certificate - `certificates.cert-manager.io`
  * Challenges - `challenges.acme.cert-manager.io`
  * Cluster Issuer -`clusterissuers.cert-manager.io`
  * Certificate Requests - `certificaterequests.cert-manager.io`
* List all cluster issuers
  * `kubectl get clusterissuers`
* Describe a cluster issuer
  * `kubectl describe clusterissuers.cert-manager.io <name>`
* Delete a cluster issure
  * `kubectl delete clusterissuers.cert-manager.io <name>`
* See certificates
  * `kubectl get certificate`
  * `kubectl describe certificate <name>`
* Describe issuer
  * `kubectl describe issuer`

`kubectl describe order`
`kubectl get certificate gb-production-tls -o wide`
kubectl get certificate gb-production-tls -o wide -n cert-manager
kubectl get certificate

## Production
* Set both context and namespace for an environment
  * `yarn kube set <environment>` - environment should be one of `local`, `production`, etc...
* Set just the namespace
  * `kubectl config set-context --current --namespace=gb-production` - Namespace is set as the default
  * `devspace use namespace gb-production` - should be done automatically via devspace
* Set just the context
  * `devspace use context lke70246-ctx` - should be done automatically via devspace
  * `kubectl config set-context lke70246-ctx`
* Deploy to production kubernetes
  * `yarn dev deploy --env prod --log --skip fe`
  * **IMPORTANT** - Don't forget to add `--env prod` to ensure you are using the correct environment
* Curl cmds to test Backend API
  * `curl -kivL -H 'Host: backend.dev.gobletqa.app' -H 'Origin: localhost' 'http://45.79.63.61'`
* See the ingress-nginx, and get the IP address of it
  * `kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`

