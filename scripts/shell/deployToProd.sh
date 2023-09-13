#!/bin/bash

# Exit when any command fails
set -e
trap 'printf "\nFinished with exit code $?\n\n"' EXIT

gb_load_stdio(){
  # Ensure the goblet-application root directory env is set
  if [[ -z "$GB_ROOT_DIR" ]]; then
    printf "\033[0;31m[GOBLET]\033[0m - ENV \"GB_ROOT_DIR\" must point to the goblet-application root directory\n"
    exit 1
  fi

  . $GB_ROOT_DIR/scripts/shell/init/stdio.sh
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
pullImages(){
  echo ""
  gb_message "Pulling images locally..."
  echo ""

  pnpm doc pull be
  pnpm doc pull sc
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
switchKubeCtx(){
  echo ""
  gb_message "Switching to Kubernetes production context"
  echo ""

  pnpm kube set prod --env prod
}

# Navigate to the test action repository, and builds a local image
# Does **NOT** push the image to a remote repository
deployBackend(){
  echo ""
  gb_message "Deploying backend images to production cluster..."
  echo ""

  pnpm dep be --env prod --clean
}

# Navigate to the test action repository, and builds a local image
# Does **NOT** push the image to a remote repository
deployFrontend(){
  echo ""
  gb_message "Building and deploying frontend to firebase..."
  echo ""

  pnpm dep fe --env prod
}

# Entry point for building Docker Action Images
__main__(){
  gb_load_stdio
  
  pullImages
  switchKubeCtx
  deployBackend
  deployFrontend

  echo ""
  gb_success "Finished deploying to production"
  echo ""
}


__main__
