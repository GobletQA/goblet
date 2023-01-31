#!/bin/bash

gb_remove_local_docker(){
  rm -rf ~/Library/Group\ Containers/group.com.docker
  rm -rf ~/Library/Containers/com.docker.docker
  rm -rf ~/.docker
  rm -rf ~/Library/Application\ Support/com.docker.docker
  rm -rf ~/Library/Application\ Support/Docker\ Desktop
  rm -rf /usr/local/bin/docker
}

# Download the docker.dmg from the docker site
gb_mac_download_install_docker(){
  if [[ ! -f "$GB_DOCKER_DMG_PATH" ]]; then
    gb_info "Downloading docker.dmg ($GB_DOCKER_DMG_PATH) ..."
    # Ensure the temp directory exists before downloading docker
    mkdir -p $GB_TMP_DIR
    curl -# -L -o $GB_DOCKER_DMG_PATH $GB_DOCKER_DL_MAC_URL
  fi
}

# Mound the docker volume, and get it's name
gb_mac_mount_docker_volume(){
  if [[ ! -f "$GB_DOCKER_DMG_PATH" ]]; then
    gb_error "Error downloading docker-desktop.\n\t Please download and install manually from $GB_DOCKER_DL_MAC_URL"
    exit 1
  fi

  gb_message "Mounting docker.dmg ..."
  GB_DOCKER_VOL=`hdiutil mount $GB_DOCKER_DMG_PATH | tail -n1 | perl -nle '/(\/Volumes\/[^ ]+)/; print $1'`
  
  if [[ -z "$GB_DOCKER_VOL" ]]; then
    gb_error "Could not find the docker volume name!"
    exit 1
  else
    gb_message "Docker.dmg mounted ($GB_DOCKER_VOL)"
  fi
}

# Copy the contents of the docker volume app into the /Applications directory
gb_mac_copy_docker_app(){
  gb_message "Installing docker ..."
  local GB_DOCKER_PATH="$GB_DOCKER_VOL/$GB_DOCKER_APP"
  local GB_DOCKER_APP_PATH="$GB_APPLICATIONS/$GB_DOCKER_APP"

  yes | cp -ir $GB_DOCKER_PATH $GB_DOCKER_APP_PATH

  if [[ -d "$GB_DOCKER_APP_PATH" ]]; then
    gb_message "Starting docker desktop ..."
    open -a "$GB_DOCKER_APP_PATH"
  else
    gb_error "Could not find the docker app in the volume $GB_DOCKER_VOL!"
  fi
}

# Remove the mounted docker volume and downloded docker.dmg file
gb_mac_unmount_docker_volume(){
  gb_message "Cleaning up temp files ..."
  hdiutil unmount $GB_DOCKER_VOL -quiet
  rm $GB_DOCKER_DMG_PATH
}

# Checks if docker-for-desktop app is already installed
gb_check_docker_app(){

  # Check if docker already exists, and return if it does
  if [[ -x "$(command -v docker -v 2>/dev/null)" ]]; then
    gb_message "Docker already installed, skipping"
    return
  fi

  local GB_DOCKER_APP_PATH="$GB_APPLICATIONS/$GB_DOCKER_APP"
  if [[ -d "$GB_DOCKER_APP_PATH" ]]; then
    gb_info "Starting docker desktop ..."
    open -a "$GB_DOCKER_APP_PATH"
    return
  fi

  # Get the os to know which url to use
  local GB_OS_TYPE=$(uname)
  if [[ "$GB_OS_TYPE" == "Darwin" ]]; then
    # Download the docker dmg and install the docker desktop app
    gb_mac_download_install_docker
    gb_mac_mount_docker_volume
    gb_mac_copy_docker_app

    # Clean up after installing
    gb_mac_unmount_docker_volume

    # Set a flag so we know docker-desktop was downloaded
    export DOCKER_DOWNLOADED=1
  else
    gb_error "Downloading docker-desktop is only supported on a Mac OS.\n\t Please download docker manually"
    exit 1
  fi
}
