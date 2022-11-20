ARG GB_IMAGE_FROM=mcr.microsoft.com/playwright:v1.28.0-focal

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

RUN <<EOF
  apt update
  # apt install -y --no-install-recommends build-essential zlib1g zlib1g-dev autoconf
  apt install -y --no-install-recommends build-essential
  # yarn install --frozen-lockfile
EOF
RUN yarn install --frozen-lockfile

# ---- End Stage ---- #

# ---- Build Stage ---- #
FROM $GB_IMAGE_FROM as goblet-build
WORKDIR /goblet/app
COPY --from=goblet-installer /goblet/app/ .
COPY . .
RUN yarn build:docker
# ---- End Stage ---- #

# ---- Run Stage  ---- #
FROM $GB_IMAGE_FROM as goblet-runner
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

ENV HOME=/root \
    DISPLAY=:0.0 \
    LC_ALL=C.UTF-8 \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US.UTF-8 \
    DEBUG=pw:api*,pw:browser*,pw:error*,pw:proxy* \
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
    PATH=$PATH:/usr/local/share/.config/yarn/global/node_modules/.bin

RUN <<EOF
  set -eux;
  # Enabel all sources
  sed -i 's/# deb/deb/g' /etc/apt/sources.list
  # Preinstall any dependecies for settting up the image
  apt-get update && apt-get install --yes --no-install-recommends \
    curl \
    novnc \
    openssh-client \
    ca-certificates \
    tigervnc-standalone-server

  yarn global add pm2
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:retain '7'
  pm2 set pm2-logrotate:rotateInterval '0 0 * * 1'
  echo fs.inotify.max_user_watches=1048576 | tee -a /etc/sysctl.conf
  sysctl -p
  /bin/sed -i '1s|.*|root:x:0:0:root:/root:/bin/bash|g' /etc/passwd
  curl -fsSL https://get.docker.com | sh

  # Download kubectl
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x kubectl
  mv ./kubectl /usr/bin/kubectl

  apt-get clean
  apt-get autoclean
  apt-get autoremove
  rm -rf /var/lib/apt/lists/*
  rm -rf /var/lib/apt/lists.d/*
EOF

COPY --from=goblet-build /goblet/app/ .

RUN <<EOF
  ln -s /goblet/app/node_modules $HOME/.node_modules
  ln -s /goblet/app/node_modules /goblet/node_modules
  mv /goblet/app/container/scripts/docker/be.entrypoint.sh /entrypoint.sh
  chmod a+x /entrypoint.sh
  chmod a+x /goblet/app/container/initialize.sh
EOF

EXPOSE $GB_FE_PORT
EXPOSE $GB_BE_PORT
EXPOSE $GB_SC_PORT
EXPOSE $GB_NO_VNC_PORT
EXPOSE $GB_VNC_SERVER_PORT

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "container/initialize.sh" ]
