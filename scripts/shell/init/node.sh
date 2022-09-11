#!/bin/bash

# Ensures nvm is in the current terminal session
gb_source_nvm(){
  PREFIX=
  npm_config_prefix=
  [ -z "$NVM_DIR" ] && export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && source "${NVM_DIR}/nvm.sh" --install
}

# Ensure nvm is loded then sets the correct node version
gb_set_node_version(){
  gb_source_nvm
  nvm use $GB_NODE_VERSION
}

# Check and install nvm and node
gb_setup_nvm_node(){

  local HAS_NVM=""

  if [[ -d "$HOME/.nvm" ]]; then
    gb_source_nvm

    local NVM_VER="$(nvm --version)"
    # Sort the env version and the locally installed version
    local VERSIONS="$GB_NVM_VER\n$NVM_VER\n"
    local SORTED=($(printf $VERSIONS | sort -V))
    # After sort, pull the last item from the list, which should be the highest version
    local HIGHEST_VER="${SORTED[@]: -1:1}"
    # Check if the current version is equal to the highest version
    # If it is, then we don't need to update
    if [[ "$NVM_VER" == "$HIGHEST_VER" ]]; then
      HAS_NVM="true"
    fi

  fi

  # If no NVM, or has NVM and it's outdated, then reinstall nvm
  if [[ -z "$HAS_NVM" ]]; then

    gb_info "Installing NVM..."
    # Download and run the bash install script
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$GB_NVM_VER/install.sh | bash
    echo "$NVM_INSTALL"

    gb_success "NVM and node installation complete"

  else
    gb_message "NVM already installed, skipping"
  fi

  gb_source_nvm
  local NODE_VER="$(nvm current)"
  if [[ "$NODE_VER" != "$GB_NODE_VERSION" ]]; then
    nvm install $GB_NODE_VERSION
  fi
}

# Checks if the ~/.npmrc file exists, and creates it if needed
gb_setup_npmrc(){
  if [[ -f "$GB_NPMRC_PATH" ]]; then
    # TODO: Investigate checking the content of the .npmrc file
    # Ensure the git token has been added
    # This is needed in cases when the user has an existsing ./.npmrc file
    # But it is not configured properly
    gb_message "The $GB_NPMRC_PATH file already exists, skipping"
    return
  else
    [ -z "$GB_GIT_TOKEN" ] && gb_setup_github_pat

    gb_info "Adding goblet repositry to $GB_NPMRC_PATH"

    # Add content to the ~/.npmrc file including the github PAT
    # The file is outside of the repo, so the PAT will not be tracked by git
    echo "//npm.pkg.github.com/:_authToken=$GB_GIT_TOKEN" > $GB_NPMRC_PATH
    echo "@gobletqa:registry=https://npm.pkg.github.com" >> $GB_NPMRC_PATH
    echo "registry=https://registry.npmjs.org" >> $GB_NPMRC_PATH

  fi
}

# Sets up the github PAT by loading it locally or asking the user to create one on github and accepting the PAT as input
gb_setup_github_pat(){

  # If the file already exists, load it and use it
  [  -f "$GB_GIT_PAT_PATH" ] && export GB_GIT_TOKEN=$(cat $GB_GIT_PAT_PATH)

  # It the GB_GIT_TOKEN is still not set, then ask the user to create one
  # Then save it locally
  if [[ -z "$GB_GIT_TOKEN" ]]; then
    echo ""
    gb_message "Please enter your Github Personal Access Token, then press \"${CYAN_COL}enter${NO_COL}\""
    printf "\t A Token can be created by visiting https://github.com/settings/tokens\n\n${CYAN_COL}Github Personal Access Token: ${NO_COL}"

    # Ask the question, and capture the input
    local NEW_TOKEN=$(gb_question)
    # Trim any whitespace from the token
    NEW_TOKEN=`echo $NEW_TOKEN`

    # Ensure a token was entered as input
    if [[ -z "$NEW_TOKEN" ]]; then
      gb_error "A Github Personal Access Token is required!"
      exit 1
    fi

    # Ensure the temp directory exists before adding the new token
    mkdir -p $GB_TMP_DIR

    # Add the key to the local file
    echo "$NEW_TOKEN" > $GB_GIT_PAT_PATH

    # Ensure it can be accesses by other methods
    export GB_GIT_TOKEN=$NEW_TOKEN
  fi

}
