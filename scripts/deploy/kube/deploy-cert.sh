#!/bin/bash

# To Run
# /bin/bash scripts/deploy/kube/deploy-cert.sh
# docker pull chrismeller/certs

# Add the `Certs` Helm repository
helm repo add certs https://math-nao.github.io/certs/charts
# helm repo add certs oci://docker.io/chrismeller/certs
# docker pull chrismeller/certs:latest
# helm repo add certs oci://chrismeller/certs:latest

# Update your local Helm chart repository cache
helm repo update

# Install the `Certs` Helm chart in the same namespace than your ingresses
helm install certs --namespace gb-production --values container/values.certs.yaml certs/certs

helm upgrade certs /Users/lancetipton/goblet/repos/certs/certs --namespace gb-production --values container/values.certs.yaml --install --force --reset-values

helm uninstall certs --namespace gb-production
helm repo remove certs --namespace gb-production
