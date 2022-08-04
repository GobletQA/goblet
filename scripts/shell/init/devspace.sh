#!/bin/bash

# Checks and installs devspace and dependencies
gb_check_devspace_and_dependencies(){
  # Check and install kubectl
  gb_brew_check_install "kubectl" "kubectl version --client"
  # Check and install devspace
  gb_brew_check_install "devspace" "devspace -v"
}

# Sets up devspace for running the application in a kubernetes cluster
gb_setup_devspace(){
  devspace use namespace $GB_KUBE_NAMESPACE --kube-context $GB_KUBE_CONTEXT
}
