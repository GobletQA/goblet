#!/bin/bash

source ~/keg-cli/keg

# Prints an log message to the terminal in the color white
gb_log(){
  printf "${WHITE_COL}[GOBLET]${NO_COL} - $@\n"
}

# Prints an success message to the terminal in the color green
gb_success(){
  printf "${GREEN_COL}[GOBLET]${NO_COL} - $@\n"
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildBaseImg(){
  echo ""
  gb_log "Building Goblet Base Image"
  echo ""

  pnpm doc build base push
  pnpm doc pull base
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildGobletAction(){
  echo ""
  gb_log "Building Goblet Action Image"
  echo ""

  pnpm doc build act push
  pnpm doc pull act
}

# Navigate to the test action repository, and builds a local image
# Does **NOT** push the image to a remote repository
buildTestAction(){
  echo ""
  gb_log "Building Goblet Test Action Image"
  echo ""

  keg gta
  pnpm dbl
}

# Entry point for building Docker Action Images
__main__(){
  buildBaseImg
  buildGobletAction
  buildTestAction

  echo ""
  gb_success "Finished building Images"
  echo ""
}


__main__