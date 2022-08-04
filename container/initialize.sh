#! /bin/bash
echo "Sleeping for 10 seconds to allow sync to complete..."
sleep 10
echo "Starting goblet application..."

# When running in dev, sometimes we need to add new packages
# Only needed in development
goblet_run_dev_yarn_install(){
  if [ "$GB_NM_INSTALL" == "all" ]; then
    echo "Running yarn install for all repos..."
    cd /keg/tap
    yarn install

  elif [ "$GB_NM_INSTALL" == "$GB_SUB_REPO" ]; then
    echo "Running yarn install for $GB_SUB_REPO..."
    cd /keg/tap/repos/$GB_SUB_REPO
    yarn install
  fi
}

# Check if we should install new packages
[ -z "$GB_NM_INSTALL" ] && goblet_run_dev_yarn_install
 

# Starts the screen cast servers
# TODO: this should be done via pm2 instead
gobletRunScreencast(){

  # Check if the vnc screen-cast servers should be started
  START_VNC_SERVER=""
  if [[ -z "$GOBLET_SUB_REPO" ]]; then
    START_VNC_SERVER=1
  elif [[ "$GOBLET_SUB_REPO" == "screencast" ]]; then
    START_VNC_SERVER=1
  fi

  # Starts the screen cast servers when not using a websocket from the hostmachine
  if [[ "$GB_VNC_ACTIVE" == "true" || "$START_VNC_SERVER" ]]; then
    cd /keg/tap/repos/screencast
    yarn sc:pm2 >> /proc/1/fd/1 &
  fi
}

# If a sub-repo is defined only run that one repo
# Check if the process to run is defined, then run it
if [[ "$GOBLET_SUB_REPO" ]]; then

  gobletRunScreencast "$@"

  cd repos/$GOBLET_SUB_REPO
  yarn pm2 >> /proc/1/fd/1 &
else
  # Start each of the services and canvas
  yarn pm2
  tail -f /keg/tap/logs/*.* >> /proc/1/fd/1 &
fi

# Tail /dev/null to keep the container running
tail -f /keg/tap/logs/*.* && exit 0;