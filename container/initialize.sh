#! /bin/bash

echo "Starting goblet application..."

set -Eeo pipefail

# When running in dev, sometimes we need to add new packages
# Only needed in development
goblet_run_dev_yarn_install(){
  if [ "$GB_NM_INSTALL" == "all" ]; then
    echo "Running yarn install for all repos..."
    cd /goblet/app
    yarn install

  elif [ "$GB_NM_INSTALL" == "$GB_SUB_REPO" ]; then
    echo "Running yarn install for $GB_SUB_REPO..."
    cd /goblet/app/repos/$GB_SUB_REPO
    yarn install
  fi
}

goblet_screencast(){
  if [ "$PW_DEBUG_FILE" ]; then
    export DEBUG_FILE=$PW_DEBUG_FILE
  else
    export DEBUG_FILE=/goblet/app/logs/pwlogs.log
  fi

  touch $DEBUG_FILE
  cd /goblet/app/repos/screencast
  yarn vnc:start >> /proc/1/fd/1 &
}

# Check if we should install new packages
[ "$GB_NM_INSTALL" ] && goblet_run_dev_yarn_install

# If a sub-repo is defined only run that one repo
# Check if the process to run is defined, then run it
if [ "$GB_SUB_REPO" ]; then

  # Handle repo specific tasks as needed
  [ "$GB_SUB_REPO" == "screencast" ] && goblet_screencast

  cd /goblet/app/repos/$GB_SUB_REPO
  yarn start >> /proc/1/fd/1 &
  # Tail /dev/null to keep the container running
  tail -f /dev/null && exit 0;
else
  # Start each of the services via pm2
  yarn pm2
  # Tail the logs dir to keep the container running
  tail -f /goblet/app/logs/*.log && exit 0;
fi
