#!/bin/bash

# Exit when any command fails
set -e
trap 'printf "\nFinished with exit code $?\n\n"' EXIT
source ~/keg-cli/keg

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
buildBaseImg(){
  echo ""
  gb_message "Building Goblet Base Image"
  echo ""

  pnpm doc build base push
  pnpm doc pull base
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildGobletAction(){
  echo ""
  gb_message "Building Goblet Action Image"
  echo ""

  pnpm doc build act push
  pnpm doc pull act
}

# Navigate to the test action repository, and builds a local image
# Does **NOT** push the image to a remote repository
buildTestAction(){
  echo ""
  gb_message "Building Goblet Test Action Image"
  echo ""

  keg gta
  pnpm dbl
}

# Entry point for building Docker Action Images
__main__(){
  gb_load_stdio

  buildBaseImg
  buildGobletAction
  buildTestAction

  echo ""
  gb_success "Finished building Images"
  echo ""
}


__main__
