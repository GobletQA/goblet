#!/bin/bash

set -ex

exec supervisord -n -c configs/supervisord.conf
