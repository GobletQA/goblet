#!/bin/bash

# Checks and installs devspace and dependencies
gb_check_devspace_and_dependencies(){
  # Check and install kubectl
  gb_brew_check_install "kubectl" "kubectl version --client"

  # Check and install helm
  gb_brew_check_install "helm" "helm version"

  # Check and install devspace
  gb_global_check_install "devspace@$GB_DEVSPACE_VERSION" "devspace -v"
  # Doing a check for the version will force the correct executabe to download
  devspace -v
}

# Sets up devspace for running the application in a kubernetes cluster
gb_setup_devspace(){
  devspace use namespace $GB_KUBE_NAMESPACE --kube-context $GB_KUBE_CONTEXT
}
