#!/bin/bash

# Exit when any command fails
set -e
trap 'printf "\nFinished with exit code $?\n\n"' EXIT

cleanup(){
  gb_error "Script failed, resetting kube ctx..."
  switchDevKubeCtx
}

gb_load_stdio(){
  # Ensure the goblet-application root directory env is set
  if [[ -z "$GB_ROOT_DIR" ]]; then
    printf "\033[0;31m[GOBLET]\033[0m - ENV \"GB_ROOT_DIR\" must point to the goblet-application root directory\n"
    exit 1
  fi

  . $GB_ROOT_DIR/scripts/shell/init/stdio.sh
}

# Pull the most recently built images locally
# Probably not needed, but doesn't hurt
pullImages(){
  echo ""
  gb_message "Pulling images locally..."
  echo ""

  pnpm doc pull be
  pnpm doc pull sc
}

# Switch to the production kube context
switchProdKubeCtx(){
  echo ""
  gb_message "Switching to Kubernetes production context"
  echo ""

  pnpm kube set prod --env prod
}

# Switch back to the dev kube context
switchDevKubeCtx(){
  echo ""
  gb_message "Switching to Kubernetes dev context"
  echo ""
  GB_KUBE_CONTEXT=docker-desktop pnpm kube set dev
}

# Navigate to the test action repository, and builds a local image
# Does **NOT** push the image to a remote repository
deployBackend(){
  echo ""
  gb_message "Deploying backend chart to production cluster..."
  echo ""

  pnpm dep be --env prod --clean
  gb_success "Backend chart deployed to production cluster succesfully"
}

# Navigate to the test action repository, and builds a local image
# Does **NOT** push the image to a remote repository
deployFrontend(){
  echo ""
  gb_message "Building and deploying frontend to firebase..."
  echo ""

  pnpm dep fe --env prod
  gb_success "Frontend bundle pushed to firebase succesfully"
}


# Entry point for deploying to production
__main__(){
  gb_load_stdio
  
  pullImages
  switchProdKubeCtx
  deployBackend
  deployFrontend
  switchDevKubeCtx

  echo ""
  gb_success "Finished deploying to production"
  echo ""
}


__main__
