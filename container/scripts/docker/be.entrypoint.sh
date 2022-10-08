#! /bin/sh

if [ "$GB_SUB_REPO" == "backend" ]; then
  if [ "$GOBLET_DIND_SERVICE_PORT" ]; then
    export GOBLET_DIND_SERVICE_HOST=${GOBLET_DIND_SERVICE_HOST:-0.0.0.0}
    export GOBLET_DIND_SERVICE_PORT=${GOBLET_DIND_SERVICE_PORT:-2573}
    GB_DIND_HOST=${GB_DD_DEPLOYMENT:-$GOBLET_DIND_SERVICE_HOST}
    export DOCKER_HOST="tcp://$GB_DIND_HOST:$GOBLET_DIND_SERVICE_PORT"
    echo "$DOCKER_AUTH_PASSWORD" | docker login $DOCKER_REGISTRY --username $DOCKER_AUTH_USER --password-stdin

    cd /goblet/app/repos/backend
    yarn pull >> /proc/1/fd/1 &
    cd /goblet/app

  fi
fi

exec $@
