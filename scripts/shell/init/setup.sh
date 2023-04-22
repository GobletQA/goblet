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

goblet_print_config_message(){
  gb_info "Kubernetes is required to execute the setup tasks"
  gb_message "  - Please enable kubernetes from the docker-desktop ui"
  gb_message "  - Then run \"pnpm make setup\" from the projects root directory"
  echo ""
}

# Runs the setup tasks to ensure kuberentes is configured properly
goblet_run_setup_tasks() {
  
  # If docker was just installed, we can't run the setup tasks
  # So print a message and return
  if [ "$DOCKER_DOWNLOADED" ]; then
    goblet_print_config_message
    return
  fi

  goblet_ensure_root


  # Setup the nginx ingress for the current namespace
  pnpm kube ingress

  # Setup kuberenetes secrets for docker user and password
  pnpm kube auth
}
