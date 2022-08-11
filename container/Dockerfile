
ARG GB_IMAGE_FROM=mcr.microsoft.com/playwright:v1.23.4-focal

# ---- Prune Stage ---- #
FROM $GB_IMAGE_FROM as goblet-pruner
WORKDIR /goblet/app
COPY . .
RUN cd /goblet/app/repos && \
    mkdir -p ../out/json/repos && \
    find . -name 'package.json' -print0 -exec cp -fprv --parents '{}' '../out/json/repos' ';' && \
    cd /goblet/app/out/json/repos && \
    rm -rf ./**/node_modules && \
    cp /goblet/app/yarn.lock /goblet/app/out/json/yarn.lock && \
    cp /goblet/app/package.json /goblet/app/out/json/package.json
# ---- End Stage ---- #

# ---- Install Stage  ---- #
FROM $GB_IMAGE_FROM as goblet-installer
WORKDIR /goblet/app
COPY --from=goblet-pruner /goblet/app/out/json/ .
RUN yarn install --frozen-lockfile
# ---- End Stage ---- #

# ---- Build Stage ---- #
FROM $GB_IMAGE_FROM as goblet-build
WORKDIR /goblet/app
COPY --from=goblet-installer /goblet/app/ .
COPY . .
RUN yarn build
# ---- End Stage ---- #

# ---- Run Stage  ---- #
FROM $GB_IMAGE_FROM as goblet-runner
WORKDIR /goblet/app
ENV HOME=/root \
    DISPLAY=:0.0 \
    DEBUG=pw:api* \
    LC_ALL=C.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8 \
    EXPO_CLI_VERSION=5.3.2 \
    DEBIAN_FRONTEND=noninteractive \
    PATH=$PATH:/usr/local/share/.config/yarn/global/node_modules/.bin

RUN apt-get update && apt-get install -y --no-install-recommends \
    novnc \
    tigervnc-standalone-server \
    apt-get clean && \
    apt-get autoclean && \
    apt-get autoremove && \
    rm -rf /var/cache/apk/*; \
    yarn global add pm2 expo-cli@$EXPO_CLI_VERSION; \
    pm2 install pm2-logrotate && \
    pm2 set pm2-logrotate:retain '7' && \
    pm2 set pm2-logrotate:rotateInterval '0 0 * * 1'; \
    echo fs.inotify.max_user_watches=1048576 | tee -a /etc/sysctl.conf; \
    sysctl -p; \
    /bin/sed -i '1s|.*|root:x:0:0:root:/root:/bin/bash|g' /etc/passwd

ARG GB_FE_PORT=19006
ARG GB_BE_PORT=7005
ARG GB_SC_PORT=7006
ARG GB_CD_PORT=9901
ARG GB_NO_VNC_PORT=26369
ARG GB_VNC_SERVER_PORT=26370
ARG PLAYWRIGHT_BROWSERS_VERSION

EXPOSE $GB_FE_PORT
EXPOSE $GB_BE_PORT
EXPOSE $GB_SC_PORT
EXPOSE $GB_CD_PORT
EXPOSE $GB_NO_VNC_PORT
EXPOSE $GB_VNC_SERVER_PORT

ENV GB_FE_PORT=$GB_FE_PORT \
    GB_BE_PORT=$GB_BE_PORT \
    GB_SC_PORT=$GB_SC_PORT \
    GB_CD_PORT=$GB_CD_PORT \
    GB_NO_VNC_PORT=$GB_NO_VNC_PORT \
    GB_VNC_SERVER_PORT=$GB_VNC_SERVER_PORT \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    PLAYWRIGHT_BROWSERS_VERSION=$PLAYWRIGHT_BROWSERS_VERSION

COPY --from=goblet-build /goblet/app/ .
RUN ln -s /goblet/app/node_modules $HOME/.node_modules && \
    ln -s /goblet/app/node_modules /goblet/node_modules

CMD [ "/bin/bash", "container/initialize.sh" ]
