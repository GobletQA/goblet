ARG GB_IMAGE_FROM=ghcr.io/gobletqa/goblet-base:latest
ARG IMAGE_FROM=$GB_IMAGE_FROM

# ---- Kubectrl Stage ( backend only ) ---- #
FROM bitnami/kubectl:latest as kubectl
# ---- End Stage ---- #

# ---- Run files Stage ---- #
FROM $IMAGE_FROM as goblet-run-files
WORKDIR /goblet/app
COPY tasks ./tasks
COPY configs ./configs
COPY container ./container
COPY tsconfig.json gobletRoot.js ./
RUN rm -rf repos \
    rm -rf node_modules
# ---- End Stage ---- #


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
COPY repos/devtools/package.json repos/devtools/
COPY configs/package.json configs/
COPY repos/conductor/package.json repos/conductor/
COPY repos/logger/package.json repos/logger/
COPY repos/latent/package.json repos/latent/
COPY repos/goblet/package.json repos/goblet/
COPY repos/git/package.json repos/git/
COPY repos/repo/package.json repos/repo/
COPY repos/workflows/package.json repos/workflows/
COPY repos/backend/package.json repos/backend/
COPY repos/browser/package.json repos/browser/
COPY repos/screencast/package.json repos/screencast/
COPY repos/testify/package.json repos/testify/
COPY repos/exam/package.json repos/exam/
COPY repos/shared/package.json repos/shared/
COPY repos/environment/package.json repos/environment/
RUN pnpm fetch --no-optional --ignore-scripts
COPY . .
RUN pnpm install --prefer-offline --no-optional --fix-lockfile --force
COPY configs ./configs
RUN pnpm build:tsup && \
    rm -rf tasks && \
    rm -rf configs && \
    rm -rf container && \
    rm -rf tsconfig.json && \
    rm -rf gobletRoot.js
# ---- End Stage ---- #


# ---- Run Stage  ---- #
FROM goblet-setup as goblet-runner
WORKDIR /goblet/app
COPY --from=kubectl /opt/bitnami/kubectl/bin/kubectl /usr/bin/
COPY --from=goblet-run-files /goblet/app/ .

RUN ln -s /goblet/app/repos/screencast/node_modules $HOME/.node_modules && \
    ln -s /goblet/app/repos/screencast/node_modules /goblet/node_modules && \
    chmod a+x /goblet/app/container/initialize.sh

CMD [ "container/initialize.sh" ]
