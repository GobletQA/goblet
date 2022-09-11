/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 * Test script by running the following command
 * GB_FE_ACTIVE=goblet-frontend GB_BE_ACTIVE=goblet-backend node scripts/js/resolveSync.js GB_FE_ACTIVE GB_BE_ACTIVE
 */
const { resolveValues } = require('./resolveValues')

const sharedIgnore = (`
  - '.*'
  - 'node_modules'
  - 'node_modules/**'
  - 'container/scripts'
  - 'container/.devspace'
  - 'container/templates'
`)

const syncFrontendConfig = (deployment) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  excludePaths:
  - '**'
  - '!/'
  - 'temp'
  - 'logs'
  - 'tasks'
  - 'certs'
  - 'goblet'
  - 'repos/dind'
  - 'repos/scripts'
  - 'repos/backend'
  - 'repos/conductor'
  - 'repos/screencast'
${sharedIgnore}
`)

const syncBackendConfig = (deployment) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  excludePaths:
  - '**'
  - '!/configs'
  - '!/container'
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


const syncSCConfig = (deployment) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  excludePaths:
  - '**'
  - '!/configs'
  - '!/container'
  - '!/repos/screencast'
  - '!/repos/shared'
  - '!/repos/sockr'
  - '!/repos/testUtils'
  - '!/repos/workflows'
${sharedIgnore}
`)

/**
 * Check if the app is being deploy
 * If it is, build the sync config based off the deployment
 */
const generateSync = (isActiveEnv, backend, type, remoteDir) => {
  const deployment = process.env[isActiveEnv]

  return (!isActiveEnv || !deployment)
    ? ``
    : type === `dd`
      ? syncDDConfig(deployment, remoteDir)
      : type === `sc`
        ? syncSCConfig(deployment)
        : Boolean(deployment)
          ? backend
            ? syncBackendConfig(deployment)
            : syncFrontendConfig(deployment)
          : ``
}

const envs = resolveValues()
const args = process.argv.slice(2)

const feDeployment = generateSync(args.shift())
const beDeployment = generateSync(args.shift(), true)
const ddDeployment = generateSync(args.shift(), true, `dd`, envs.GB_DD_CADDY_REMOTE_DIR)
const scDeployment = generateSync(args.shift(), true, `sc`)

let syncs = ``
feDeployment && (syncs += feDeployment)
beDeployment && (syncs += beDeployment)
ddDeployment && (syncs += ddDeployment)
scDeployment && (syncs += scDeployment)

process.stdout.write(syncs)
