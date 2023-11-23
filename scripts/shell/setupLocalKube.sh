#!/bin/bash

# Exit when any command fails
set -e
trap cleanup EXIT

cleanup(){
  gb_message "Finished with exit code $?\n"
}

gb_load_stdio(){
  # Ensure the goblet-application root directory env is set
  if [[ -z "$GB_ROOT_DIR" ]]; then
    printf "\033[0;31m[GOBLET]\033[0m - ENV \"GB_ROOT_DIR\" must point to the goblet-application root directory\n"
    exit 1
  fi

  . $GB_ROOT_DIR/scripts/shell/init/stdio.sh
}

# Pulls the app image from container registry
registryLogin(){
  echo ""
  gb_message "Logging into docker"
  echo ""

  pnpm doc login
}


# Pulls the app image from container registry
setupKubeSecrets(){
  echo ""
  gb_message "Setting auth secret"
  echo ""
  pnpm kube secret auth

  local GB_FIREBASE_SA=~/.kegConfig/goblet/goblet-dev-firebase-sa.json

  if [[ -f "$GB_FIREBASE_SA" ]]; then
    echo ""
    gb_message "Setting firebase secret"
    echo ""
    pnpm kube secret firebase --file $GB_FIREBASE_SA
  fi

  echo ""
  gb_message "Setting goblet secret"
  echo ""
  pnpm kube secret goblet
}


# Pulls the app image from container registry
pullGobletApp(){
  echo ""
  gb_message "Pulling Goblet App Image"
  echo ""

  pnpm doc pull app
}


# Entry point for deploying to production
__main__(){
  gb_load_stdio

  # Add task for doing this
  # kubectl config set-context --current --namespace=gb-local

  registryLogin
  setupKubeSecrets
  pullGobletApp

  echo ""
  gb_success "Finished setting up local kube"
  echo ""
}


__main__
