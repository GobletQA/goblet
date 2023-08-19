# Production Deploy

## Deploy Backend Only
```sh
  pnpm kube set prod --env prod && pnpm dev clean --images --env prod && pnpm dep be --env prod
```

## Deploy Frontend Only
```sh
  pnpm kube set prod --env prod && pnpm dep fe --env prod
```

## Full Deploy
```sh
  pnpm kube set prod --env prod && pnpm dev clean --images --env prod && pnpm dep be --env prod && pnpm dep fe --env prod
```

## Backend - Steps

### From Scratch
* Set the namespace and context
  * `pnpm kube set prod --env prod`
* Add the docker image pull secrets
  * `pnpm kube secret auth --env prod --log`
* Add the cloud provider API Token secrets
  * `pnpm kube secret provider --env prod --cert --log`
* Add firebase service-account secret
  * `pnpm kube secret firebase --env prod --log`
* Deploy the Nginx Ingress Controller
  * `pnpm kube ingress --env prod --log`
* Deploy the Backend Apps
  * `pnpm dev deploy --env prod`
* Deploy KCert
  * `kubectl apply -f scripts/deploy/kube/cert.yaml`

### Re-Deploy

* Set the namespace and context
  * `pnpm kube set prod --env prod`
* Clean existing pods and images
  * `pnpm dev clean --env prod --images`
  * You can also use the `--clean` option in the deploy command
* Deploy the Backend Apps
  * `pnpm dep be --env prod`
    * With clean - `pnpm dep be --env prod --clean` - **TYPICAL**
    * Alternative - `pnpm dev deploy --env prod` - does the same as `pnpm dep be` cmd

### Clean Prod

* Set the namespace and context
  * `pnpm kube set prod --env prod`
* Clean Prod
  * `pnpm dev clean --env prod`
  * Add `--images` to also delete existing docker images


## Frontend - Steps

### Re-Deploy
* Ensure firebase is installed
* Set the namespace and context
  * `pnpm kube set prod --env prod`
* Deploy the Frontend Apps
  * `pnpm dep fe --env prod`


## Helpful Command
* Set both context and namespace for an environment
  * `pnpm kube set <environment>` - environment should be one of `local`, `production`, etc...
* Set just the namespace
  * `kubectl config set-context --current --namespace=gb-production` - Namespace is set as the default
  * `devspace use namespace gb-production` - should be done automatically via devspace
* Set just the context
  * `devspace use context lke70246-ctx` - should be done automatically via devspace
  * `kubectl config set-context lke70246-ctx`
* Deploy to production kubernetes
  * `pnpm dev deploy --env prod --skip fe`
  * **IMPORTANT** - Don't forget to add `--env prod` to ensure you are using the correct environment
* Curl cmds to test Backend API
  * `curl -kivL -H 'Host: backend.dev.gobletqa.app' -H 'Origin: http://localhost:19006' 'http://45.79.62.67'`
  * `curl -kivL -H 'Origin: http://localhost:19006' 'https://backend.dev.gobletqa.app'`
* See the ingress-nginx, and get the IP address of it
  * `kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`
* Watch ingress deployment status
  * `kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`


### TODO: add task to create linode token, to ensure goblet-certs can create ssl certs