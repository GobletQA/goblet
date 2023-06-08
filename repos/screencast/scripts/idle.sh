#!/bin/bash


# ---- IMPORTANT -------
# This script is not currently being used
# It's just a reference for potentially adding other idle checks
# If the network connections work, then this file can be removed
# ---- IMPORTANT -------

# Define the idle criteria thresholds
NETWORK_CONNECTION_THRESHOLD=1
CPU_THRESHOLD=10
MEMORY_THRESHOLD=10
DISK_THRESHOLD=1

# Function to check if the container is idle
check_idle() {
  # Check network connections
  # apt install net-tools -y
  
  network_connections=$(netstat -an | grep ESTABLISHED | grep -v 26370 | wc -l)
  if [[ $network_connections -le $NETWORK_CONNECTION_THRESHOLD ]]; then
    return 1
  fi

  # Check CPU usage
  cpu_usage=$(top -bn1 | awk '/^%Cpu/ {print $2}')
  if [[ $cpu_usage -le $CPU_THRESHOLD ]]; then
    return 1
  fi

  # Check memory usage
  memory_usage=$(free -m | awk '/^Mem/ {print $3}')
  if [[ $memory_usage -le $MEMORY_THRESHOLD ]]; then
    return 1
  fi

  # Check disk I/O
  # apt install sysstat -y

  disk_io=$(iostat -dx | awk '/^[v|x]d/ {print $NF}' | tr -d '.')
  if [[ $disk_io -le $DISK_THRESHOLD ]]; then
    return 1
  fi

  return 0
}

# Main script loop
while true; do
  if check_idle; then
    echo "Container is idle."
    # Execute your logic for idle state here
    # ...
    break
  fi

  sleep 10  # Adjust the sleep duration as needed
done
