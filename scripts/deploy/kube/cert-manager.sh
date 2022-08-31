#!/bin/bash

# Download cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.8.0/cert-manager.crds.yaml

# Creat a namespace for if
kubectl create namespace cert-manager

# Add the jetstack repo to helm
helm repo add cert-manager https://charts.jetstack.io
# Load the new repo into helm
helm repo update

# Deploy the new cert-manager to the kube cluster
helm install gb-cert-manager cert-manager/cert-manager --namespace cert-manager --version v1.8.0

# Get the pod to validate it was deployed
kubectl get pods --namespace cert-manager


# Create an issuer
kubectl create --edit -f https://raw.githubusercontent.com/cert-manager/website/master/content/docs/tutorials/acme/example/production-issuer.yaml
