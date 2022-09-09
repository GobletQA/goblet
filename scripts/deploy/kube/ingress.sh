#!/bin/bash

# 
# Creates an nginx ingress on the same name-space as the goblet pods
# Does not seem to be supported via devspace.yaml config file
# Using the `upgrade` command should allow this it to be idempotent
# 

helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace gb-production --create-namespace

