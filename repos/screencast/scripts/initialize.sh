#!/bin/bash

set -ex

exec supervisord -n -c configs/supervisord.conf

# See here => https://georgik.rocks/how-to-start-d-bus-in-docker-container/
# Explains how to run dbus in docker container
# Seems to be needed for Playwright
dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address