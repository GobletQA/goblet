#!/bin/bash

# **IMPORTANT** - This file is not used
# Was testing using tcpdump for inactive session-container
# Keeping as it would be better to use this inated
# Plan to update to it at some point
# Would need to install `tcpdump` and `iproute2` within the container before using
# CMD: apt install tcpdump iproute2 -y


# tcpdump -i "eth0" -n -q -tttt -c 1 > /dev/null 2>&1 &
# tcpdump -i "eth0" -tttt -n --direction=in
# tcpdump -i "eth0" -tttt -q --direction=out -c 1 'tcp port 19011 not arp and not port 53'
# tcpdump -i "eth0" -tttt -q --direction=out -c 1 'tcp port 19011 and not arp'


INTERFACE=$(ip route | grep default | awk '{print $5}')

# Set the threshold time (in seconds) for inactivity
THRESHOLD=300  # 300 seconds (5 minutes) of inactivity

# Function to perform an action when there's no traffic
action_on_inactivity() {
    echo "No traffic for $THRESHOLD seconds. Performing action..."
    # Add your custom action here
    # For example, you can send an alert or execute a command
}

# Monitor network traffic using tcpdump
tcpdump -i "$INTERFACE" -n -q -tttt -c 5 > /dev/null 2>&1 &

# Store the PID of the background tcpdump process
TCPDUMP_PID=$!

# Initialize the timestamp
LAST_ACTIVITY=$(date +%s)

while true; do
    # Check if the tcpdump process is still running
    if ! ps -p $TCPDUMP_PID > /dev/null; then
        echo "tcpdump process has exited. Exiting..."
        exit 1
    fi

    # Check for network activity
    if [[ $(date +%s) -gt $((LAST_ACTIVITY + THRESHOLD)) ]]; then
        # No network activity detected for THRESHOLD seconds
        action_on_inactivity
        break  # You can choose to exit the script or continue monitoring
    fi

    # Sleep for a short duration (adjust as needed)
    sleep 10
done
