#!/bin/bash

# set -Eeo pipefail

# Define the idle criteria thresholds
GB_SC_PORT=${GB_SC_PORT:-19011}
GB_NO_VNC_PORT=${GB_NO_VNC_PORT:-26369}
GB_VNC_SERVER_PORT=${GB_VNC_SERVER_PORT:-26370}
GB_SC_IDLE_INTERVAL=${GB_SC_IDLE_INTERVAL:-20}
GB_SC_IDLE_THRESHOLD=${GB_SC_IDLE_THRESHOLD:-4}
GB_SC_IDLE_WAIT_TO_START=${GB_SC_IDLE_WAIT_TO_START:-180}
GB_SC_IDLE_CONNECTION_THRESHOLD=${GB_SC_IDLE_CONNECTION_THRESHOLD:-2}
GB_APP_TEMP_PATH=${GB_APP_TEMP_PATH:-"temp"}
GB_APP_MOUNT_PATH=${GB_APP_MOUNT_PATH:-"/goblet/app"}
GB_SC_RESET_CONNECTION_FILE=${GB_SC_RESET_CONNECTION_FILE:-"reset-connection-check"}
GB_RESET_CONNECTION_PATH="$GB_APP_MOUNT_PATH/$GB_APP_TEMP_PATH/$GB_SC_RESET_CONNECTION_FILE"

[[ "$NODE_ENV" == "local" ]] && SupCfgLoc=supervisord.local.conf || SupCfgLoc=supervisord.conf
[[ "$GB_LOCAL_DEV_MODE" == "false" ]] && SupCfgLoc=supervisord.conf

# Ensure the idle connection threshold is at least 2
[[ $GB_SC_IDLE_CONNECTION_THRESHOLD -le 2 ]] && GB_SC_IDLE_CONNECTION_THRESHOLD=2

# Prints an error message to the terminal in the color white
gb_log(){
  if [ "$GB_SC_IDLE_DEBUG" == "true" ] || [ "$GB_SC_IDLE_DEBUG" == "1" ]; then
    echo "$@" >> /proc/1/fd/1
  fi
}

# Starts supervisor using the config based on the current $NODE_ENV
startSup(){
  gb_log "Starting supervisor with config \"configs/$SupCfgLoc\""
  exec supervisord -n -c configs/$SupCfgLoc >> /proc/1/fd/1 &
  gb_log "Supervisor started successfully!"
}

# Stops any running supervisor services
stopSup(){
  gb_log "Stopping supervisor..."
  supervisorctl -c configs/$SupCfgLoc shutdown all

  # In local, we call kill command on the "tail /dev/null" process to force kill the container
  pid=$(ps -ef | grep /dev/null | grep -v grep | awk '{print $2}')

  if [[ "$pid" ]]; then
    gb_log "Killing tail pid: $pid"
    kill -9 $pid
  fi

  # In non-local environemnt, this is the init script, so we just need to exit
  exit 0
}

# Calls the screencast server to let it know the container is going idle
# This allows it to send a message to the frontend about going idle
# Call looks something like this
# /usr/bin/node -e "fetch('http://0.0.0.0:$GB_SC_PORT/idle-check?counter=1&connections=20&state=idle')"
callSCServer(){
  local PATH="idle-check"
  local HOST="http://0.0.0.0:$GB_SC_PORT"
  local QUERY="counter=$1&connections=$2&state=$3"

  # Use node fetch to make api call
  # I did not want to install another dep just to make this api call
  # And curl is not installed
  /usr/bin/node -e "fetch('$HOST/$PATH?$QUERY')"
}

# Uses a while loop to loop forever
# On each looop iteraction, checks the number of active network connections
# If they are less then the defined connection threshold, then will shutdown supervisor
loopConnectionsCheck(){

  # Wait the defined time until we should start checking for active connections
  gb_log "Waiting $GB_SC_IDLE_WAIT_TO_START seconds to start Container idle check..."
  sleep $GB_SC_IDLE_WAIT_TO_START

  gb_log "Starting idle timeout check..."

  local IdleCounter=0
  local halfTotal=$(( $GB_SC_IDLE_THRESHOLD / 2 ))
  local ResetConCheck=0

  # Start looping forever
  while true; do

  
    gb_log ""
    gb_log "Checking active connections..."
    local EstablishedCons=$(netstat -an | grep ESTABLISHED | grep -v $GB_VNC_SERVER_PORT | wc -l)

    gb_log "Total Active Connections: $EstablishedCons"
    gb_log "Idle Connection Threshold:  $GB_SC_IDLE_CONNECTION_THRESHOLD"
    gb_log "Idle counter is: $IdleCounter"
    
    gb_log "Check Reset File: \"$GB_RESET_CONNECTION_PATH\""

    if [[ -f "$GB_RESET_CONNECTION_PATH" ]]; then
      ResetConCheck=1
      break
    fi

    if [[ $EstablishedCons -le $GB_SC_IDLE_CONNECTION_THRESHOLD ]]; then

      gb_log "The Active Connections are less than the Idle Connections Threshold"

      # If the container was idle more consecutive times the defined GB_SC_IDLE_THRESHOLD amount
      if [[ $IdleCounter -ge $GB_SC_IDLE_THRESHOLD ]]; then
        gb_log "Container is considered idle due to conscutive connection checks, sutting down..."
        # First shutdown supervisor gracefully
        # In production this should kill the container
        callSCServer "$IdleCounter" "$EstablishedCons" "shutdown"
        stopSup

        break

      else

        IdleCounter=$(($IdleCounter + 1))
        gb_log "Container is idle, updated container idle count to: $IdleCounter"

        if [[ $IdleCounter -ge $halfTotal ]]; then
          callSCServer "$IdleCounter" "$EstablishedCons" "idle"
        fi

      fi

    else

      # TODO: this does not work properly and cause the container status to be reset
      # Fix this
      if [[ $IdleCounter -ge $halfTotal ]]; then 
        callSCServer "$IdleCounter" "$EstablishedCons" "active"
      fi

      IdleCounter=0
      gb_log "Container passed idle connections check. Reset container idle count to $IdleCounter"

    fi

    # Wait the defined amount of time before doing the next check
    sleep $GB_SC_IDLE_INTERVAL
  done
  
  if [[ ResetConCheck -eq 1 ]]; then
    rm "$GB_RESET_CONNECTION_PATH"
    IdleCounter=0
    ResetConCheck=0
    gb_log "Found reset file, resetting connection check..."
    gb_log ""
    loopConnectionsCheck "$@"
  fi

}

# First start supervisor, to ensure all services are running
startSup "$@"

# Then run the loop connections check forever until the container is killed
loopConnectionsCheck "$@"

