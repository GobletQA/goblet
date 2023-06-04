ARG GB_IMAGE_FROM=mcr.microsoft.com/playwright:v1.32.0-focal

# ---- PNPM State  ---- #
FROM $GB_IMAGE_FROM as goblet-pnpm
WORKDIR /goblet/app
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm@8.3.1
COPY .npmrc pnpm-*.yaml ./
RUN pnpm fetch --no-optional --ignore-scripts
COPY package.json ./
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
    net-tools \
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
    rm -rf /var/lib/apt/lists.d/*
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


# ---- Build files Stage ---- #
FROM goblet-pnpm as goblet-build-files
WORKDIR /goblet/app
COPY tsconfig.json gobletRoot.js ./
COPY configs/alias* configs/goblet* configs/paths.config.js configs/
# ---- End Stage ---- #


# ---- Run files Stage ---- #
FROM goblet-pnpm as goblet-run-files
WORKDIR /goblet/app
COPY tasks ./tasks
COPY container ./container
COPY configs/app.pm2.config.js configs/
COPY configs/firebase.config.js configs/
COPY configs/tasks.config.js configs/
# ---- End Stage ---- #


# ---- Workflows Stage  ---- #
FROM goblet-pnpm AS goblet-workflows
WORKDIR /goblet/app
COPY repos/workflows/package.json repos/workflows/
RUN pnpm install --no-optional --offline --frozen-lockfile --ignore-scripts --filter workflows
COPY repos/workflows repos/workflows/
# ---- End Stage ---- #


# ---- Shared Stage  ---- #
FROM goblet-workflows AS goblet-shared
WORKDIR /goblet/app
COPY repos/shared/package.json repos/shared/
RUN pnpm install --no-optional --offline --frozen-lockfile --ignore-scripts --filter shared
COPY repos/shared repos/shared/
# ---- End Stage ---- #


# ---- Conductor Stage  ---- #
FROM goblet-shared AS goblet-conductor
WORKDIR /goblet/app
COPY repos/conductor/package.json repos/conductor/
RUN pnpm install --no-optional --offline --frozen-lockfile --ignore-scripts --filter conductor
COPY repos/conductor repos/conductor/
# ---- End Stage ---- #


# ---- Backend Stage  ---- #
FROM goblet-conductor AS goblet-backend
WORKDIR /goblet/app
COPY repos/backend/package.json repos/backend/
RUN pnpm install --no-optional --offline --frozen-lockfile --ignore-scripts --filter backend
COPY repos/backend repos/backend/
COPY --from=goblet-build-files /goblet/app .
WORKDIR /goblet/app/repos/backend
RUN pnpm build:docker
WORKDIR /goblet/app
# ---- End Stage ---- #


# ---- Screencast Stage  ---- #
FROM goblet-shared AS goblet-screencast
WORKDIR /goblet/app
COPY repos/screencast/package.json repos/screencast/
RUN pnpm install --no-optional --offline --frozen-lockfile --ignore-scripts --filter screencast
COPY repos/screencast repos/screencast/
# ---- End Stage ---- #


# ---- TestUtils Stage  ---- #
FROM goblet-screencast AS goblet-testutils
WORKDIR /goblet/app
COPY repos/testUtils/package.json repos/testUtils/
RUN pnpm install --no-optional --offline --frozen-lockfile --ignore-scripts --filter testUtils
COPY repos/testUtils repos/testUtils/
COPY --from=goblet-build-files /goblet/app .
# Can only build screencast after testutils repo has been setup
WORKDIR /goblet/app/repos/screencast
RUN pnpm build:docker
WORKDIR /goblet/app
# ---- End Stage ---- #


# ---- Run Stage  ---- #
FROM goblet-setup as goblet-runner
WORKDIR /goblet/app

COPY --from=goblet-testutils /goblet/app/ .
COPY --from=goblet-backend /goblet/app/ .
COPY --from=goblet-run-files /goblet/app/ .

RUN ln -s /goblet/app/node_modules $HOME/.node_modules && \
    ln -s /goblet/app/node_modules /goblet/node_modules && \
    chmod a+x /goblet/app/container/initialize.sh

CMD [ "container/initialize.sh" ]
