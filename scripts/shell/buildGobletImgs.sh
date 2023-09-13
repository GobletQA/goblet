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
buildBaseImg(){
  echo ""
  gb_message "Building Goblet Base Image"
  echo ""

  pnpm doc build base push
  pnpm doc pull base
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildGobletApp(){
  echo ""
  gb_message "Building Goblet App Image"
  echo ""

  pnpm doc build app push
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildGobletBackend(){
  echo ""
  gb_message "Building Goblet Backend Image"
  echo ""

  pnpm doc build be push
}


# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildGobletScreencast(){
  echo ""
  gb_message "Building Goblet Screencast Image"
  echo ""

  pnpm doc build sc push
}

# Entry point for building Docker Action Images
__main__(){
  gb_load_stdio

  buildBaseImg
  buildGobletApp
  buildGobletBackend
  buildGobletScreencast

  echo ""
  gb_success "Finished building Images"
  echo ""
}


__main__