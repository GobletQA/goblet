ARG GB_IMAGE_FROM=ghcr.io/gobletqa/goblet-base:latest
ARG IMAGE_FROM=$GB_IMAGE_FROM


# ---- Build files Stage ---- #
FROM $IMAGE_FROM as goblet-build-files
WORKDIR /goblet/app
COPY tsconfig.json gobletRoot.js ./
COPY configs/alias* configs/goblet* configs/paths.config.js configs/
# ---- End Stage ---- #


# ---- Run files Stage ---- #
FROM $IMAGE_FROM as goblet-run-files
WORKDIR /goblet/app
COPY tasks ./tasks
COPY container ./container
COPY configs/app.pm2.config.js configs/
COPY configs/firebase.config.js configs/
COPY configs/tasks.config.js configs/
# ---- End Stage ---- #


# ---- Workflows Stage  ---- #
FROM $IMAGE_FROM AS goblet-repos
WORKDIR /goblet/app
COPY repos/workflows/package.json repos/workflows/
COPY repos/conductor/package.json repos/conductor/
COPY repos/backend/package.json repos/backend/
COPY repos/screencast/package.json repos/screencast/
COPY repos/testUtils/package.json repos/testUtils/
COPY repos/shared/package.json repos/shared/
COPY repos/latent/package.json repos/latent/
RUN pnpm install --no-optional --offline --frozen-lockfile --ignore-scripts
# ---- End Stage ---- #


# ---- Shared Stage  ---- #
FROM goblet-repos AS goblet-built
WORKDIR /goblet/app
COPY repos/workflows repos/workflows/
COPY repos/conductor repos/conductor/
COPY repos/backend repos/backend/
COPY repos/screencast repos/screencast/
COPY repos/testUtils repos/testUtils/
COPY repos/shared repos/shared/
COPY repos/latent repos/latent/
COPY --from=goblet-build-files /goblet/app .
WORKDIR /goblet/app/repos/backend
RUN pnpm build:docker
WORKDIR /goblet/app/repos/screencast
RUN pnpm build:docker
WORKDIR /goblet/app
# ---- End Stage ---- #


# ---- Run Stage  ---- #
FROM goblet-built as goblet-runner
WORKDIR /goblet/app

COPY --from=goblet-run-files /goblet/app/ .
COPY --from=goblet-built /goblet/app/ .

RUN ln -s /goblet/app/node_modules $HOME/.node_modules && \
    ln -s /goblet/app/node_modules /goblet/node_modules && \
    chmod a+x /goblet/app/container/initialize.sh

CMD [ "container/initialize.sh" ]
