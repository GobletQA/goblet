#!/bin/bash

# set -Eeo pipefail

# Define the idle criteria thresholds
GB_SC_IDLE_INTERVAL=${GB_SC_IDLE_INTERVAL:-20}
GB_SC_IDLE_THRESHOLD=${GB_SC_IDLE_THRESHOLD:-4}
GB_SC_IDLE_WAIT_TO_START=${GB_SC_IDLE_WAIT_TO_START:-180}
GB_SC_IDLE_CONNECTION_THRESHOLD=${GB_SC_IDLE_CONNECTION_THRESHOLD:-1}

[[ "$NODE_ENV" == "local" ]] && SupCfgLoc=supervisord.local.conf || SupCfgLoc=supervisord.conf


# Prints an error message to the terminal in the color white
gb_log(){
  [ "$GB_SC_IDLE_DEBUG" ] && echo "$@"
}

# Starts supervisor using the config based on the current $NODE_ENV
startSup(){
  gb_log "Starting supervisor..."
  exec supervisord -n -c configs/$SupCfgLoc >> /proc/1/fd/1 &
}

# Stops any running supervisor services
stopSup(){
  gb_log "Stopping supervisor..."
  supervisorctl -c configs/$SupCfgLoc shutdown all

  # In local, we call kill command on the "tail /dev/null" process to force kill the container
  pid=$(ps -ef | grep /dev/null | grep -v grep | awk '{print $2}')

  if [ "$pid" ]; then
    gb_log "Killing tail pid: $pid"
    # kill -9 $pid
  fi
}


# Uses a while loop to loop forever
# On each looop iteraction, checks the number of active network connections
# If they are less then the defined connection threshold, then will shutdown supervisor
loopConnectionsCheck(){

  # Wait the defined time until we should start checking for active connections
  gb_log "Waiting $GB_SC_IDLE_WAIT_TO_START seconds to start Container idle check..."
  sleep $GB_SC_IDLE_WAIT_TO_START

  gb_log "Starting idle timeout check..."

  IdleCounter=0

  # Start looping forever
  while true; do

    gb_log "Checking active network connections..."
    EstablishedCons=$(netstat -an | grep ESTABLISHED | grep -v 26370 | wc -l)
    gb_log "Found $EstablishedCons active connections"

    if [[ $EstablishedCons -le $GB_SC_IDLE_CONNECTION_THRESHOLD ]]; then

      gb_log "The active connections count of $EstablishedCons is less or equal to the $GB_SC_IDLE_CONNECTION_THRESHOLD connections threshold"

      # If the container was idle more consecutive times the defined GB_SC_IDLE_THRESHOLD amount
      if [[ $IdleCounter -ge $GB_SC_IDLE_THRESHOLD ]]; then
        gb_log "Container is considered idle due to conscutive connection checks, sutting down..."
        # First shutdown supervisor gracefully
        # In production this should kill the container
        stopSup

        break

      else
        IdleCounter=$(($IdleCounter + 1))
        gb_log "Container is idle, updated container idle count to: $IdleCounter"
      fi

    else

      IdleCounter=0
      gb_log "Container passed idle connections check. Reset container idle count to $IdleCounter"

    fi

    # Wait the defined amount of time before doing the next check
    sleep $GB_SC_IDLE_INTERVAL
  done
}

# First start supervisor, to ensure all services are running
startSup "$@"

# Then run the loop connections check forever until the container is killed
loopConnectionsCheck "$@"
