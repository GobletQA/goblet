# Production Deploy


## Helpful Command
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
  * `curl -kivL -H 'Host: backend.dev.gobletqa.app' -H 'Origin: http://localhost:19006' 'http://45.79.62.67'`
  * `curl -kivL -H 'Origin: http://localhost:19006' 'https://backend.dev.gobletqa.app'`
* See the ingress-nginx, and get the IP address of it
  * `kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`
* Watch ingress deployment status
  * `kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`


## Backend - Steps

### From Scratch
* Set the namespace and context
  * `yarn kube set prod --env prod --log`
* Add the docker image pull secrets
  * `yarn kube secret docker --env prod --log`
* Add the cloud provider API Token secrets
  * `yarn kube secret provider --env prod --cert --log`
* Deploy the Nginx Ingress Controller
  * `yarn kube ingress --env prod --log`
* Deploy the Backend Apps
  * `yarn dev deploy --env prod --ds backend --log`
* Deploy KCert
  * `kubectl apply -f scripts/deploy/kube/cert.yaml`

### Re-Deploy

* Set the namespace and context
  * `yarn kube set prod --env prod --log`
* Deploy the Backend Apps
  * `yarn dev deploy --env prod --ds backend --log`

### Clean Prod

* Set the namespace and context
  * `yarn kube set prod --env prod --log`
* Clean Prod
  * `yarn dev clean --env prod --ds backend --log`


### TODO: add task to create linode token, to ensure goblet-certs can create ssl certs


## Frontend - Steps

### Re-Deploy

* Set the namespace and context
  * `yarn kube set prod --env prod --log`
* Deploy the Frontend Apps
  * `yarn deploy fe --env prod --log`


## Full Deploy Command
```sh
  yarn kube set prod --env prod --log && yarn dev clean --images --env prod --ds backend --log && yarn dev deploy --env prod --ds backend --log && yarn deploy fe --env prod --log
```
