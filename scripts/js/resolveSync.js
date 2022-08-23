/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 */
const { resolveValues } = require('./resolveValues')

const sharedIgnored = `
  - node_modules/
  - .*
  - /container/.*
  - /container/scripts
  - /container/templates
  - /container/Dockerfile*
  - /deploy
  - /docs
  - /helm
  - /scripts
  - /tasks
  - __tests__/
  - __mocks__/
`

const syncFrontendConfig = (deployment) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  uploadExcludePaths:
  - /repos/backend
  - /repos/conductor
  - /repos/screencast
  ${sharedIgnored}
`)

const syncBackendConfig = (deployment) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  uploadExcludePaths:
  - /repos/frontend
  - /repos/traceViewer
  ${sharedIgnored}
`)

const syncDDConfig = (deployment, remoteDir=`/goblet/remote`) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: preferLocal
  localSubPath: ../repos/dind/etc
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
  uploadExcludePaths:
  - /repos/backend
  - /repos/conductor
  - /repos/frontend
  - /repos/traceViewer
  - node_modules/
  - .*
  - /container/.*
  - /container/scripts
  - /container/templates
  - /container/Dockerfile*
  - /docs
  - /helm
  - __tests__/
  - __mocks__/
`)

/**
 * Check if the app is being deploy
 * If it is, build the sync config based off the deployment
 */
const generateSync = (isActiveEnv, backend, type, remoteDir) => {
  const deployment = process.env[isActiveEnv]
  return type === `dd`
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
// const pxDeployment = generateSync(args.shift(), true)

let syncs = ``
feDeployment && (syncs += feDeployment)
beDeployment && (syncs += beDeployment)
ddDeployment && (syncs += ddDeployment)
scDeployment && (syncs += scDeployment)
// pxDeployment && (syncs += pxDeployment)

process.stdout.write(syncs)
