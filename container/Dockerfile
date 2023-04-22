ARG GB_IMAGE_FROM=mcr.microsoft.com/playwright:v1.32.0-focal

FROM $GB_IMAGE_FROM as goblet-pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm

# ---- Prune Stage ---- #
FROM goblet-pnpm as goblet-pruner
WORKDIR /goblet/app
COPY . .
RUN <<EOF
  set -eux;
  rm -rf repos/components
  rm -rf repos/monaco
  rm -rf repos/resizer
  rm -rf repos/race
  rm -rf repos/traceViewer
  rm -rf repos/vite
  cd /goblet/app/repos
  mkdir -p ../out/json/repos
  find . -name 'package.json' -print0 -exec cp -fprv --parents '{}' '../out/json/repos' ';'
  cd /goblet/app/out/json/repos
  rm -rf ./**/node_modules
  cp /goblet/app/.nvmrc /goblet/app/out/json/.nvmrc
  cp /goblet/app/.npmrc /goblet/app/out/json/.npmrc
  cp /goblet/app/turbo.json /goblet/app/out/json/turbo.json
  cp /goblet/app/package.json /goblet/app/out/json/package.json
  cp /goblet/app/pnpm-lock.yaml /goblet/app/out/json/pnpm-lock.yaml
  cp /goblet/app/pnpm-workspace.yaml /goblet/app/out/json/pnpm-workspace.yaml
EOF
# ---- End Stage ---- #

# ---- Install Stage  ---- #
FROM goblet-pnpm as goblet-installer
WORKDIR /goblet/app
COPY --from=goblet-pruner /goblet/app/out/json/ .
RUN <<EOF
  set -eux;
  pnpm add --global dot-json turbo
  pnpm json:rm
  pnpm json:repo-rm
  pnpm config set network-timeout 600000
  pnpm install
EOF
# ---- End Stage ---- #

FROM bitnami/kubectl:latest as kubectl

# ---- Build Stage ---- #
FROM goblet-pnpm as goblet-build
WORKDIR /goblet/app
COPY --from=goblet-installer /goblet/app/ .
COPY . .
RUN pnpm build:docker
# ---- End Stage ---- #

# ---- Run Stage  ---- #
FROM goblet-pnpm as goblet-runner
WORKDIR /goblet/app

ARG GB_FE_PORT=19006
ARG GB_BE_PORT=7005
ARG GB_SC_PORT=7006
ARG GB_DD_DEPLOYMENT
ARG GB_NO_VNC_PORT=26369
ARG GB_DD_API_PROXY_PORT=2121
ARG GB_DD_WS_PROXY_PORT=2122
ARG GB_DD_VNC_PROXY_PORT=2123
ARG GB_VNC_SERVER_PORT=26370
ARG PLAYWRIGHT_BROWSERS_VERSION
ARG PW_DEBUG_FILE=/goblet/app/logs/pwlogs.log
ARG DEBUG_FILE=$PW_DEBUG_FILE

ENV HOME=/root \
    DISPLAY=:0.0 \
    LC_ALL=C.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8 \
    DEBUG=pw:* \
    PWDEBUG=console \
    DEBUG_FILE=$DEBUG_FILE \
    DEBIAN_FRONTEND=noninteractive \
    GB_FE_PORT=$GB_FE_PORT \
    GB_BE_PORT=$GB_BE_PORT \
    GB_SC_PORT=$GB_SC_PORT \
    GB_NO_VNC_PORT=$GB_NO_VNC_PORT \
    GB_VNC_SERVER_PORT=$GB_VNC_SERVER_PORT \
    GB_DD_WS_PROXY_PORT=$GB_DD_WS_PROXY_PORT \
    GB_DD_API_PROXY_PORT=$GB_DD_API_PROXY_PORT \
    GB_DD_VNC_PROXY_PORT=$GB_DD_VNC_PROXY_PORT \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    PLAYWRIGHT_BROWSERS_VERSION=$PLAYWRIGHT_BROWSERS_VERSION \
    DBUS_SYSTEM_BUS_ADDRESS=unix:path=/var/run/dbus/system_bus_socket

RUN <<EOF
  set -eux;
  # Enabel all sources
  sed -i 's/# deb/deb/g' /etc/apt/sources.list
  # Preinstall any dependecies for settting up the image
  apt-get update && apt-get install --yes --no-install-recommends \
    curl \
    novnc \
    supervisor \
    openssh-client \
    ca-certificates \
    tigervnc-standalone-server

  echo fs.inotify.max_user_watches=1048576 | tee -a /etc/sysctl.conf
  sysctl -p
  /bin/sed -i '1s|.*|root:x:0:0:root:/root:/bin/bash|g' /etc/passwd

  apt-get clean
  apt-get autoclean
  apt-get autoremove
  rm -rf /var/lib/apt/lists/*
  rm -rf /var/lib/apt/lists.d/*

  # See here => https://georgik.rocks/how-to-start-d-bus-in-docker-container/
  # Explains how to run dbus in docker container
  # Seems to be needed for Playwright
  dbus-uuidgen > /var/lib/dbus/machine-id
  mkdir -p /var/run/dbus
EOF

COPY --from=goblet-build /goblet/app/ .

RUN <<EOF
  ln -s /goblet/app/node_modules $HOME/.node_modules
  ln -s /goblet/app/node_modules /goblet/node_modules
  chmod a+x /goblet/app/container/initialize.sh
EOF

COPY --from=kubectl /opt/bitnami/kubectl/bin/kubectl /usr/bin/

EXPOSE $GB_FE_PORT
EXPOSE $GB_BE_PORT
EXPOSE $GB_SC_PORT
EXPOSE $GB_NO_VNC_PORT
EXPOSE $GB_VNC_SERVER_PORT

CMD [ "container/initialize.sh" ]
