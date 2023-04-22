#! /bin/bash

echo "Starting goblet application..."

set -Eeo pipefail

# Runs all apps together with PM2
# Used for running goblet in a single docker container
goblet_run_pm2(){
  # Ensure PM2 is installed
  pnpm add --global add pm2
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:retain '7'
  pm2 set pm2-logrotate:rotateInterval '0 0 * * 1'

  # Start each of the services via pm2
  pnpm pm2
  # Tail the logs dir to keep the container running
  tail -f /goblet/app/logs/*.log && exit 0;
}


# When running in dev, sometimes we need to add new packages
# Only needed in development
goblet_run_dev_install(){
  if [ "$GB_NM_INSTALL" == "all" ]; then
    echo "Running pnpm install for all repos..."
    cd /goblet/app
    pnpm install

  elif [ "$GB_NM_INSTALL" == "$GB_SUB_REPO" ]; then
    echo "Running pnpm install for $GB_SUB_REPO..."
    cd /goblet/app/repos/$GB_SUB_REPO
    pnpm install
  fi
}

goblet_screencast(){
  if [ "$PW_DEBUG_FILE" ]; then
    export DEBUG_FILE=$PW_DEBUG_FILE
  else
    export DEBUG_FILE=/goblet/app/logs/pwlogs.log
  fi

  LOG_DIR=$( dirname "$DEBUG_FILE" )
  mkdir -p $LOG_DIR
  touch $DEBUG_FILE


  cd /goblet/app/repos/screencast
  exec supervisord -c configs/supervisord.dev.conf >> /proc/1/fd/1 &

  # See here => https://georgik.rocks/how-to-start-d-bus-in-docker-container/
  # Explains how to run dbus in docker container
  # Seems to be needed for Playwright
  # dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address
}

# Check if we should install new packages
[ "$GB_NM_INSTALL" ] && goblet_run_dev_install

# If a sub-repo is defined only run that one repo
# Check if the process to run is defined, then run it
if [ "$GB_SUB_REPO" ]; then

  # Handle repo specific tasks as needed
  [ "$GB_SUB_REPO" == "screencast" ] && goblet_screencast

  cd /goblet/app/repos/$GB_SUB_REPO
  pnpm start >> /proc/1/fd/1 &
  # Tail /dev/null to keep the container running
  tail -f /dev/null && exit 0;
else
  # Otherwise run all apps together with PM2
  goblet_run_pm2
fi
