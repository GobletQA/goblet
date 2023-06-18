#!/bin/bash

# set -Eeo pipefail

service_account(){
  if [ "$FIREBASE_SERVICE_ACCOUNT" ]; then
    echo "$FIREBASE_SERVICE_ACCOUNT" >> /etc/fb-service-account.json
    unset FIREBASE_SERVICE_ACCOUNT
    export GOOGLE_APPLICATION_CREDENTIALS=/etc/fb-service-account.json
  fi
}

init(){
  service_account "$@"
  pnpm serve
}

init "$@"
