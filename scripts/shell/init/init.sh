#! /usr/bin/env bash

#
# Checks and installs all needed software for running the goblet application
# Location of goblet-application repo can be overwritten by setting the $GB_ROOT_DIR env
#

# Exit when any command fails
set -e
trap 'printf "\nFinished with exit code $?\n\n"' EXIT

# Loads the environment needed to setup the host machine
gb_load_env(){

  # Ensure the goblet-application root directory env is set
  if [[ -z "$GB_ROOT_DIR" ]]; then
    printf "\033[0;31m[GOBLET]\033[0m - ENV \"GB_ROOT_DIR\" must point to the goblet-application root directory\n"
    exit 1
  fi

  # Ensure the temp install directory exists
  export GB_TMP_DIR=$GB_ROOT_DIR/.tmp

  # Build the path to the scripts directory
  export GB_INIT_DIR="$GB_ROOT_DIR/scripts/shell/init"

  # Load the envs from the .env file
  set -o allexport
  . $GB_INIT_DIR/.env >/dev/null 2>&1
  set +o allexport

  # Add the helper files
  . $GB_INIT_DIR/brew.sh
  . $GB_INIT_DIR/docker.sh
  . $GB_INIT_DIR/devspace.sh
  . $GB_INIT_DIR/node.sh
  . $GB_INIT_DIR/goblet.sh
  . $GB_INIT_DIR/stdio.sh

}

# Setups of the host machine for development of the workboard stratgy repo
gb_setup(){

  # Make sure we are in the workboard root directory
  cd $GB_ROOT_DIR

  # Determin the setup type
  local SETUP_TYPE=$1

  if [[ "$SETUP_TYPE" ]]; then
    gb_message "Setup type is $SETUP_TYPE"
  else
    gb_message "Setup type is all"
  fi

  # Setup install brew and deps
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "brew" ]]; then
    gb_message "Checking brew installation ..."
    # Ensure brew exisists and is up to date
    gb_brew_check
    # Install all deps needed for the GB applications
    gb_install_brew_deps
  fi

  # # Setup and install docker desktop
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "docker" ]]; then
    gb_message "Checking docker configuration ..."
    gb_check_docker_app
  fi

  # Setup and install nvm plus node
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "node" ]]; then
    gb_message "Checking nvm, node configuration ..."
    gb_setup_nvm_node
    # Setup .npmrc with git token
    gb_message "Checking .npmrc file configuration ..."
    gb_setup_npmrc
  fi

  # Install and configure the goblet-application git dependecies
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "repo" ]]; then
    gb_message "Checking goblet repo setup ..."
    # Install node_modules for the goblet repo
    gb_install_repo_deps
  fi

  # Install and configure devspace
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "devspace" ]]; then
    gb_message "Checking devspace setup ..."
    # Ensures devspace is installed
    gb_check_devspace_and_dependencies
    # Setup devspace for the host machine
    gb_setup_devspace
  fi

  echo ""
  gb_message_green "[GOBLET] -------------------------------- [GOBLET]"
  echo "              Goblet setup complete!"
  gb_message_green "[GOBLET] -------------------------------- [GOBLET]"
  echo ""

}

# Load the envs and helper scripts
gb_load_env "$@"

# Run setup of goblet-application repo
gb_setup "$@"

# # Cleanup after the script is done
unset GB_TMP_DIR
unset GB_INIT_DIR
unset GB_GIT_TOKEN
