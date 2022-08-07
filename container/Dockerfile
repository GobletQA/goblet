
ARG GB_IMAGE_FROM=ghcr.io/gobletqa/goblet-base:latest

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
