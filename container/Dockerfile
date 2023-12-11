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

COPY repos/devtools/package.json repos/devtools/
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
COPY repos/testUtils/package.json repos/testUtils/
COPY repos/exam/package.json repos/exam/
COPY repos/shared/package.json repos/shared/
COPY repos/environment/package.json repos/environment/
RUN pnpm install --prefer-offline --no-optional --fix-lockfile --force

COPY repos/devtools repos/devtools/
COPY repos/conductor repos/conductor/
COPY repos/logger repos/logger/
COPY repos/latent repos/latent/
COPY repos/goblet repos/goblet/
COPY repos/git repos/git/
COPY repos/repo repos/repo/
COPY repos/workflows repos/workflows/
COPY repos/browser repos/browser/
COPY repos/backend repos/backend/
COPY repos/screencast repos/screencast/
COPY repos/testUtils repos/testUtils/
COPY repos/exam repos/exam/
COPY repos/shared repos/shared/
COPY repos/environment repos/environment/

RUN rm -rf tasks \
    rm -rf configs \
    rm -rf container \
    rm -rf tsconfig.json \
    rm -rf gobletRoot.js
# ---- End Stage ---- #


# ---- Run Stage  ---- #
FROM goblet-setup as goblet-runner
WORKDIR /goblet/app
COPY --from=kubectl /opt/bitnami/kubectl/bin/kubectl /usr/bin/
COPY --from=goblet-run-files /goblet/app/ .

RUN ln -s /goblet/app/node_modules $HOME/.node_modules && \
    ln -s /goblet/app/node_modules /goblet/node_modules && \
    ln -s /ms-playwright /root/.cache/ms-playwright && \
    chmod a+x /goblet/app/container/initialize.sh

CMD [ "container/initialize.sh" ]
