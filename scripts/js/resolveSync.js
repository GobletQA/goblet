/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 * Test script by running the following command
 * GB_FE_ACTIVE=goblet-frontend GB_BE_ACTIVE=goblet-backend node scripts/js/resolveSync.js GB_FE_ACTIVE GB_BE_ACTIVE
 */
const { resolveValues, resolveConfig } = require('./resolveValues')

const config = resolveConfig()

const generateList = (list=[]) => {
  return list.reduce((acc, item) => `${acc}  - '${item}'\n`, ``).trimEnd()
}

const syncFrontendConfig = (deployment, sharedIgnore) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  excludePaths:
  - 'temp'
  - 'logs'
  - 'tasks'
  - 'certs'
  - 'goblet'
  - 'repos/kind'
  - 'repos/dind'
  - 'repos/scripts'
  - 'repos/backend'
  - 'repos/conductor'
  - 'repos/screencast'
${sharedIgnore}
`)

const syncBackendConfig = (deployment, sharedIgnore) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  excludePaths:
  - '**'
  - '!/repos/backend'
  - '!/repos/conductor'
  - '!/repos/screencast'
  - '!/repos/sockr'
  - '!/repos/shared'
${sharedIgnore}
`)

const syncDDConfig = (deployment, remoteDir=`/goblet/remote`) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: preferLocal
  localSubPath: ../repos/dind/src/etc
  containerPath: /etc
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableUpload: true
  initialSync: preferNewest
  downloadExcludePaths:
    - README.md
  localSubPath: ../repos/dind/remote
  containerPath: ${remoteDir}
`)

const syncSCConfig = (deployment, sharedIgnore) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  excludePaths:
  - '**'
  - '!/repos/screencast'
  - '!/repos/shared'
  - '!/repos/sockr'
  - '!/repos/testUtils'
  - '!/repos/workflows'
${sharedIgnore}
`)

const syncKDConfig = (deployment, sharedIgnore) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  excludePaths:
  - '**'
  - '!/repos/kind'
  - '!/repos/shared'
  - '!/repos/workflows'
${sharedIgnore}
`)

/**
 * Check if the app is being deploy
 * If it is, build the sync config based off the deployment
 */
const generateSync = ({
  type,
  backend,
  remoteDir,
  isActiveEnv,
  sharedIgnore,
}) => {
  const deployment = process.env[isActiveEnv]

  return (!isActiveEnv || !deployment)
    ? ``
    : type === `dd`
      ? syncDDConfig(deployment, remoteDir)
      : type === 'kd'
        ? syncKDConfig(deployment, sharedIgnore)
        : type === `sc`
          ? syncSCConfig(deployment, sharedIgnore)
          : Boolean(deployment)
            ? backend
              ? syncBackendConfig(deployment, sharedIgnore)
              : syncFrontendConfig(deployment, sharedIgnore)
            : ``
}

const envs = resolveValues()
const sharedIgnore = generateList(config?.apps?.default?.sync?.ignore)

const args = process.argv.slice(2)

const feDeployment = generateSync({
  sharedIgnore,
  isActiveEnv: args.shift(),
})
const beDeployment = generateSync({
  sharedIgnore,
  backend: true,
  isActiveEnv: args.shift(),
})
const ddDeployment = generateSync({
  isActiveEnv: args.shift(),
  type: `dd`,
  sharedIgnore,
  backend: true,
  remoteDir: envs.GB_DD_CADDY_REMOTE_DIR
})
const scDeployment = generateSync({
  type: `sc`,
  sharedIgnore,
  backend: true,
  isActiveEnv: args.shift(),
})
const kdDeployment = generateSync({
  type: `kd`,
  sharedIgnore,
  backend: true,
  isActiveEnv: args.shift(),
})

let syncs = ``
feDeployment && (syncs += feDeployment)
beDeployment && (syncs += beDeployment)
ddDeployment && (syncs += ddDeployment)
scDeployment && (syncs += scDeployment)
kdDeployment && (syncs += kdDeployment)

process.stdout.write(syncs)
