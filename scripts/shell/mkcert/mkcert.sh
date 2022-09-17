#! /usr/bin/env bash

#
# Checks and installs a local https ssl cert
# Should be run from the root directory
#

# Exit when any command fails
set -e
trap 'printf "\nFinished with exit code $?\n\n"' EXIT


# Loads the environment needed to setup the host machine
gb_setup_env(){

  [ -z "$GB_ROOT_DIR" ] && GB_ROOT_DIR=$(pwd)

  # Ensure in root-directory by checking if this file exists in the correct location
  if [ ! -f "$GB_ROOT_DIR/scripts/shell/mkcrt/mkcrt.sh"]; then
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
  . $GB_INIT_DIR/setup.sh
  . $GB_INIT_DIR/stdio.sh

  gb_brew_check

}

gb_ensure_certs_dir(){
  gb_message "Ensuring Certs Dir exists..."
  # Ensure the certs install directory exists
  export GB_CERTS_DIR=$GB_ROOT_DIR/certs
  mkdir -p $GB_CERTS_DIR
}

gb_generate_cert(){
  gb_message "Generating Certs via mkcert..."
  mkcert -key-file $GB_CERTS_DIR/key.pem -cert-file $GB_CERTS_DIR/cert.pem $GB_CERT_DOMAINS
}

gb_install_mkcert(){
  gb_message "Checking brew installation ..."
  brew list mkcert &>/dev/null || brew install mkcert
  brew list nss &>/dev/null || brew install nss

  mkcert -install
}

init_mkcert(){
  gb_setup_env "$@"

  # Make sure we are in the goblet root directory
  cd $GB_ROOT_DIR

  # Determin the setup type
  local SETUP_TYPE=$1

  if [[ "$SETUP_TYPE" ]]; then
    gb_message "Setup type is $SETUP_TYPE"
  else
    gb_message "Setup type is all"
  fi


  # Ensure cert dir exists
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "dir" ]]; then
    gb_ensure_certs_dir  "$@"
  fi

  # Ensure mkcert is installed
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "install" || "$SETUP_TYPE" == "inst" ]]; then
    gb_install_mkcert "$@"
  fi

  # Generate the cert via mkcert
  if [[ -z "$SETUP_TYPE" || "$SETUP_TYPE" == "gen" || "$SETUP_TYPE" == "generate" ]]; then
    gb_generate_cert "$@"
  fi

  echo ""
  gb_message_green "[GOBLET] ---------------------- [GOBLET]"
  echo "              Goblet mkcert complete!"
  gb_message_green "[GOBLET] ---------------------- [GOBLET]"
  echo ""

}


init_mkcert "$@"
