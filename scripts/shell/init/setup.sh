#!/bin/bash

# Ensures script is run from the goblet-application root directory
goblet_ensure_root() {
  # Ensure the goblet-application root directory env is set
  if [ -z "$GB_ROOT_DIR" ]; then
    if [ -f "./gobletRoot.js" ]; then
      export GB_ROOT_DIR=$(pwd)
    else
      printf "\033[0;31m[GOBLET]\033[0m - ENV \"GB_ROOT_DIR\" must point to the goblet-application root directory\n"
      exit 1
    fi
  fi

  # Ensure we are in the goblet-root dirctory
  cd $GB_ROOT_DIR

  if [ ! -f "./gobletRoot.js" ]; then
    printf "\033[0;31m[GOBLET]\033[0m - ENV \"GB_ROOT_DIR\" must point to the goblet-application root directory\n"
    exit 1
  fi
}

# Runs the setup tasks to ensure kuberentes is configured properly
goblet_run_setup_tasks() {
  goblet_ensure_root

  # Ensure devspace, kubectl, and helm are installed
  # Also sets the correct kubernetes context and namespace
  yarn make devspace

  # Setup the nginx ingress for the current namespace
  yarn kube ingress

  # Setup kuberenetes secrets for docker user and password
  # Used for downloading images in the dind container
  yarn kube auth
}
