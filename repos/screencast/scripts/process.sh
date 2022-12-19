#!/bin/bash
set -ex

# Tiger-VNC
node dist/vnc.js >> /proc/1/fd/1 &

# Web-Sockify
node dist/sock.js >> /proc/1/fd/1 &

# Browser Server
node dist/bs.js >> /proc/1/fd/1 &

# node -r esbuild-register dist/sc.js
 