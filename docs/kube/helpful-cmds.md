# Helpful kubectl commands

### See the ingress-nginx, and get the IP address of it
`kubectl --namespace gb-production get services -o wide -w ingress-nginx-controller`

### Set the default namespace
`kubectl config set-context --current --namespace=gb-production`

### Deploy production
`yarn dev deploy --env prod --log`