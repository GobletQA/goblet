#!/bin/bash


NO_COL='\033[0m'
GREEN_COL='\033[0;32m'
RED_COL='\033[0;31m'
CYAN_COL='\033[0;36m'

# Prints an error message to the terminal in the color white
gb_info(){
  printf "${CYAN_COL}[GOBLET]${NO_COL} - $@\n"
}

# Prints an success message to the terminal in the color green
gb_success(){
  printf "${GREEN_COL}[GOBLET]${NO_COL} - $@\n"
}

# Prints an error message to the terminal in the color red
gb_error(){
  printf "\n${RED_COL}[GOBLET] - $@${NO_COL}\n\n"
}

# Add sysbox to the kubernetes cluser
sysbox_add(){
    gb_info "Adding sysbox from kubernetes..."
  
  # Default to install on local Docker Dektop
  [ -z "$KUBE_NODE" ] && KUBE_NODE=docker-desktop

  # Label the node for sysbox installaion
  kubectl label nodes $KUBE_NODE sysbox-install=yes

  # Install the daemonset on to the labeled nodes
  kubectl apply -f https://raw.githubusercontent.com/nestybox/sysbox/master/sysbox-k8s-manifests/sysbox-install.yaml
  
  gb_success "Succesfully added sysbox to kubernetes"
}

# Remove sysbox from the kubernetes cluser
sysbox_remove(){
  gb_info "Removing sysbox from kubernetes..."
  
  # Remove the deamonset previously installed
  kubectl delete -f https://raw.githubusercontent.com/nestybox/sysbox/master/sysbox-k8s-manifests/sysbox-install.yaml
  sleep 30

  # Add the uninstall manifest to cleanup
  kubectl apply -f https://raw.githubusercontent.com/nestybox/sysbox/master/sysbox-k8s-manifests/sysbox-uninstall.yaml
  sleep 60

  # Remove the uninstall manifest after cleanup
  kubectl delete -f https://raw.githubusercontent.com/nestybox/sysbox/master/sysbox-k8s-manifests/sysbox-uninstall.yaml
  
  gb_success "Succesfully removed sysbox from kubernetes"
}


# Handle the sysbox command
sysbox_cmd(){
  
  if [ "$1" == "remove" ]; then
    sysbox_remove
  elif [ "$1" == "add" ]; then
    sysbox_add
  else
    gb_error "Unknown command $1"
    echo "Allowed commands are:"
    printf "  ${CYAN_COL}add${NO_COL} - Adds sysbox to kubernetes"
    printf "  ${CYAN_COL}remove${NO_COL} - Removes sysbox from kubernetes"
  fi
}

sysbox_cmd "$@"