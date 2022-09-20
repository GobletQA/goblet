#! /bin/bash

export GB_DD_DOCKER_PORT=${GB_DD_DOCKER_PORT:-2375}
export GB_DD_CADDY_HOST=${GB_DD_CADDY_HOST:-$GB_DD_DEPLOYMENT}
export GB_DD_LOCAL_ADMIN_PORT=${GB_DD_LOCAL_ADMIN_PORT:-2019}
export GB_DD_API_PROXY_PORT=${GB_DD_API_PROXY_PORT:-2121}
export GB_DD_WS_PROXY_PORT=${GB_DD_WS_PROXY_PORT:-2122}
export GB_DD_VNC_PROXY_PORT=${GB_DD_VNC_PROXY_PORT:-2123}

export GB_DD_PROXY_DOMAIN=${GB_DD_PROXY_DOMAIN:-localhost}
[ "$GOBLET_SCREENCAST_SERVICE_HOST" ] && [ "$GB_SC_DEPLOYMENT" ] && export GB_DD_PROXY_DOMAIN=$GB_SC_DEPLOYMENT

/bin/bash