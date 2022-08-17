#! /bin/bash

set -Eeo pipefail

[ -z "$GB_DD_PROXY_PORT" ] export GB_DD_PROXY_PORT=8083
[ -z "$GB_DD_PROXY_NETWORK" ] export GB_DD_PROXY_NETWORK=goblet-proxy

docker network create $GB_DD_PROXY_NETWORK

# ---- Run doc-gen with nginx as one container

# Investiagte adding the env
# -e DEFAULT_HOST=local.gobletqa.app

# docker run -d --restart always -p $GB_DD_PROXY_PORT:80 --name $GB_DD_PROXY_NETWORK --network $GB_DD_PROXY_NETWORK -v /var/run/docker.sock:/tmp/docker.sock:ro nginxproxy/nginx-proxy

docker run -d \
  --restart always \
  -p $GB_DD_PROXY_PORT:80 \
  --name $GB_DD_PROXY_NETWORK \
  --network $GB_DD_PROXY_NETWORK \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  nginxproxy/nginx-proxy


# ---- Run doc-gen with nginx as seperate container
# docker run -d \
#   --restart always \
#   --name goblet-nginx \
#   -p $GB_DD_PROXY_PORT:80 \
#   --network $GB_DD_PROXY_NETWORK \
#   -v /tmp/nginx:/etc/nginx/conf.d \
#   -v /proxy-templates/proxy-nginx.conf:/etc/nginx/proxy.conf
#   -t nginx

# docker run \
#   --restart always \
#   --name goblet-doc-gen \
#   --network $GB_DD_PROXY_NETWORK \
#   --volumes-from goblet-nginx \
#   -v /var/run/docker.sock:/tmp/docker.sock:ro \
#   -v /proxy-templates:/etc/docker-gen/templates \
#   -t jwilder/docker-gen -notify-sighup \
#   nginx -watch /etc/docker-gen/templates/nginx.tmpl /etc/nginx/conf.d/default.conf