
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
EXPOSE $KEG_PROXY_PORT
ARG KEG_PROXY_PORT=19006
ARG PLAYWRIGHT_BROWSERS_VERSION
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    PLAYWRIGHT_BROWSERS_VERSION=$PLAYWRIGHT_BROWSERS_VERSION

COPY . .
COPY --from=goblet-installer /goblet/app /goblet/app
RUN ln -s /goblet/app/node_modules $HOME/.node_modules && \
    ln -s /goblet/app/node_modules /goblet/node_modules

CMD [ "/bin/bash", "container/initialize.sh" ]
