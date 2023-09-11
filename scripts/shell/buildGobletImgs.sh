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
buildGobletApp(){
  echo ""
  gb_log "Building Goblet App Image"
  echo ""

  pnpm doc build app push
}

# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildGobletBackend(){
  echo ""
  gb_log "Building Goblet Backend Image"
  echo ""

  pnpm doc build be push
}


# Builds the Goblet Action image
# Then pushes it to th Github container registry
buildGobletScreencast(){
  echo ""
  gb_log "Building Goblet Screencast Image"
  echo ""

  pnpm doc build sc push
}

# Entry point for building Docker Action Images
__main__(){
  buildBaseImg
  buildGobletApp
  buildGobletBackend
  buildGobletScreencast

  echo ""
  gb_success "Finished building Images"
  echo ""
}


__main__