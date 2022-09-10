#!/bin/bash

kubectl create namespace caddy-system

helm install \
  --namespace=caddy-system \
  --repo https://caddyserver.github.io/ingress/ \
  --atomic \
  goblet-ingress \
  caddy-ingress-controller