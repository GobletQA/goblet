#! /bin/bash
# echo "Sleeping for 10 seconds to allow sync to complete..."
# sleep 10
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

# Check if we should install new packages
[ "$GB_NM_INSTALL" ] && goblet_run_dev_yarn_install

# If a sub-repo is defined only run that one repo
# Check if the process to run is defined, then run it
if [ "$GB_SUB_REPO" ]; then

  # Starts the vnc servers for screencast
  if [ "$GB_SUB_REPO" == "screencast" ]; then
    cd /goblet/app/repos/screencast
    yarn vnc:start >> /proc/1/fd/1 &
  fi

  cd repos/$GB_SUB_REPO
  yarn start >> /proc/1/fd/1 &
else
  # Start each of the services via pm2
  yarn start
  tail -f /goblet/app/logs/*.log >> /proc/1/fd/1 &
fi

# Tail the logs dir to keep the container running
tail -f /goblet/app/logs/*.log && exit 0;