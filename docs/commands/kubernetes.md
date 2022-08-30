# Commands - Kubernetes 

## General
* List all contexts
  * `kubectl config get-contexts`
* List all deployed services
  * `kubectl get svc`
* List all configured ingress
  * `kubectl get ingress`


## Production
* Ensure correct context is used - should be done automatically via devspace
  * `devspace use context lke70246-ctx`
* Ensure correct namespace is used - should be done automatically via devspace
  * `devspace use namespace gb-production`
* Set the default namespace
  * `kubectl config set-context --current --namespace=gb-production`
* Deploy to production kubernetes
  * `yarn dev deploy --env prod --log --skip fe`
* Curl cmds to test Backend API
  * `curl -kivL -H 'Host: backend.dev.gobletqa.app' -H 'Origin: localhost' 'http://45.79.63.61'`
* See the ingress-nginx, and get the IP address of it
  * `kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`

