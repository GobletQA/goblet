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

goblet_screencast(){

  if [ "$PW_DEBUG_FILE" ]; then
    export DEBUG_FILE=$PW_DEBUG_FILE
    LOG_DIR=$( dirname "$DEBUG_FILE" )
    mkdir -p $LOG_DIR
    touch $DEBUG_FILE

    # If DEBUG_FILE is set, but not DEBUG, then set a default
    # Otherwise the DEBUG_FILE is pointless
    [ -z "${DEBUG}" ] && export DEBUG=pw:*
  fi

  cd /goblet/app/repos/screencast

  if [ "$GB_SC_IDLE_TIMEOUT_ACTIVE" == "true" ] || [ "$GB_SC_IDLE_TIMEOUT_ACTIVE" == "1" ]; then
    # Run the init script that contains the idle timeout check
    /bin/bash ./scripts/initialize.sh >> /proc/1/fd/1 &
  else
    # Start supervisord in local environment
    exec supervisord -n -c configs/supervisord.local.conf >> /proc/1/fd/1 &
    # Wait 5 seconds, to allow the browser to be started, and create the metadata
    sleep 5
  fi

  pnpm sc:start >> /proc/1/fd/1 &

}

goblet_backend(){
  if [ "$FIREBASE_SERVICE_ACCOUNT" ]; then
    echo "$FIREBASE_SERVICE_ACCOUNT" >> /etc/fb-service-account.json
    unset FIREBASE_SERVICE_ACCOUNT
    export GOOGLE_APPLICATION_CREDENTIALS=/etc/fb-service-account.json
  fi

  cd /goblet/app/repos/devtools
  pnpm start >> /proc/1/fd/1 &

}

# If a sub-repo is defined only run that one repo
# Check if the process to run is defined, then run it
if [ "$GB_SUB_REPO" ]; then

  # Handle repo specific tasks as needed
  [ "$GB_SUB_REPO" == "backend" ] && goblet_backend

  if [ "$GB_SUB_REPO" == "screencast" ]; then
    goblet_screencast

  else
    cd /goblet/app/repos/$GB_SUB_REPO
    pnpm start >> /proc/1/fd/1 &
  fi

  # Tail /dev/null to keep the container running
  tail -f /dev/null && exit 0;
else
  # Otherwise run all apps together with PM2
  goblet_run_pm2
fi
