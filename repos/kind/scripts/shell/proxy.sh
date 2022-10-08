#! /bin/bash

export GB_KD_PORT=${GB_KD_PORT:-2375}

kubectl proxy --port $GB_KD_PORT