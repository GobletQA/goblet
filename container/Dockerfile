ARG GB_IMAGE_FROM=ghcr.io/gobletqa/goblet-base:latest
ARG IMAGE_FROM=$GB_IMAGE_FROM

# ---- Setup Stage ---- #
FROM $IMAGE_FROM as goblet-setup
WORKDIR /goblet/app
RUN mkdir -p /etc/supervisor && \
    sed -i 's/# deb/deb/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install --yes --no-install-recommends \
    socat \
    novnc \
    net-tools \
    supervisor \
    tigervnc-standalone-server && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/lib/apt/lists.d/*

COPY .npmrc pnpm-*.yaml package.json ./
RUN pnpm fetch --no-optional --ignore-scripts
COPY . .
RUN pnpm install --prefer-offline --no-optional --fix-lockfile --force && \
    pnpm build:tsup && \
    ln -s /goblet/app/repos/screencast/node_modules $HOME/.node_modules && \
    ln -s /goblet/app/repos/screencast/node_modules /goblet/node_modules && \
    chmod a+x /goblet/app/container/initialize.sh

CMD [ "container/initialize.sh" ]
# ---- End Stage ---- #
