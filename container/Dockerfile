ARG GB_IMAGE_FROM=mcr.microsoft.com/playwright:v1.32.0-focal

# ---- PNPM State  ---- #
FROM $GB_IMAGE_FROM as goblet-pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm@8.3.1
# ---- End Stage ---- #

# ---- Kubectrl Stage ( backend only ) ---- #
FROM bitnami/kubectl:latest as kubectl
# ---- End Stage ---- #


# ---- Setup Stage  ---- #
FROM goblet-pnpm as goblet-setup
WORKDIR /goblet/app
# 1. Enabel all sources
# 2. Preinstall any dependecies for settting up the image
# 3. Setups up dbus to run in docker container
#   * Seems to be needed for Playwright
#   * See here => https://georgik.rocks/how-to-start-d-bus-in-docker-container/
RUN sed -i 's/# deb/deb/g' /etc/apt/sources.list && \
    apt-get update && apt-get install --yes --no-install-recommends \
    curl \
    novnc \
    supervisor \
    openssh-client \
    ca-certificates \
    tigervnc-standalone-server && \
    echo fs.inotify.max_user_watches=1048576 | tee -a /etc/sysctl.conf && \
    sysctl -p && \
    /bin/sed -i '1s|.*|root:x:0:0:root:/root:/bin/bash|g' /etc/passwd && \
    apt-get clean && \
    apt-get autoclean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/lib/apt/lists.d/* && \
    dbus-uuidgen > /var/lib/dbus/machine-id && \
    mkdir -p /var/run/dbus
COPY --from=kubectl /opt/bitnami/kubectl/bin/kubectl /usr/bin/
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
EXPOSE $GB_FE_PORT
EXPOSE $GB_BE_PORT
EXPOSE $GB_SC_PORT
EXPOSE $GB_NO_VNC_PORT
EXPOSE $GB_VNC_SERVER_PORT
# ---- End Stage ---- #


# ---- Install Stage  ---- #
FROM goblet-pnpm as goblet-installer
WORKDIR /goblet/app
COPY pnpm-lock.yaml ./
RUN pnpm fetch
# ---- End Stage ---- #


# ---- Prune Stage ---- #
FROM goblet-pnpm as goblet-prune
WORKDIR /goblet/app
COPY .nvmrc .npmrc pnpm* *.json gobletRoot.js ./
COPY tasks ./tasks
COPY configs ./configs
COPY container ./container
COPY repos/conductor repos/conductor
COPY repos/workflows repos/workflows
COPY repos/shared repos/shared
COPY repos/backend repos/backend
COPY repos/screencast repos/screencast
COPY repos/testUtils repos/testUtils
# ---- End Stage ---- #


# ---- Build Stage ---- #
FROM goblet-pnpm as goblet-build
WORKDIR /goblet/app
COPY --from=goblet-prune /goblet/app/ .
COPY --from=goblet-installer /goblet/app/ .

# The --shamefully-hoist is required due to requirments of screencast / testUtils repos
# When a client repo is mounted, it needs access to those repos node_modules
# Which is node via a symlinkt to the /goblet/node_modules folder
RUN pnpm -r install --fix-lockfile --shamefully-hoist --prefer-offline --link-workspace-packages deep
RUN pnpm build:docker
# ---- End Stage ---- #


# ---- Run Stage  ---- #
FROM goblet-setup as goblet-runner
WORKDIR /goblet/app

COPY --from=goblet-installer /root/.local/share/pnpm /root/.local/share/pnpm
COPY --from=goblet-build /goblet/app/ .

RUN <<EOF
  ln -s /goblet/app/node_modules $HOME/.node_modules
  ln -s /goblet/app/node_modules /goblet/node_modules
  chmod a+x /goblet/app/container/initialize.sh
EOF

CMD [ "container/initialize.sh" ]
