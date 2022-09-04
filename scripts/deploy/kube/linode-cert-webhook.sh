#!/bin/bash

helm install cert-manager-webhook-linode \
  --namespace cert-manager \
  https://github.com/slicen/cert-manager-webhook-linode/releases/download/v0.2.0/cert-manager-webhook-linode-v0.2.0.tgz
  

kubectl create secret generic linode-credentials \
  --namespace=cert-manager \
  --from-literal=token="$1"

export GB_BE_CERT_ISSUER="letsencrypt-production"
export USER_EMAIL="lancetipton04@gmail.com"

GB_ISSUER_CONFIG << HEREDOC
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: $GB_BE_CERT_ISSUER
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: $USER_EMAIL
    privateKeySecretRef:
      name: $GB_BE_CERT_ISSUER
    solvers:
    - dns01:
      webhook:
        solverName: linode
        groupName: acme.slicen.me
HEREDOC


apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: ${prefixName}
spec:
  acme:
    email: ${email}
    server: ${LETS_ENCRYPT_URLS[env] || LETS_ENCRYPT_URLS.staging}
    privateKeySecretRef:
      name: ${prefixName}-secret
    solvers:
    - http01:
        ingress:
          class: nginx