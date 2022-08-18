/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 */

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

const syncDDConfig = (deployment) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: preferLocal
  localSubPath: ../repos/dind/etc
  containerPath: /etc
`)

/**
 * Check if the app is being deploy
 * If it is, build the sync config based off the deployment
 */
const generateSync = (isActiveEnv, backend, isDD) => {
  const deployment = process.env[isActiveEnv]
  return isDD
    ? syncDDConfig(deployment)
    : Boolean(deployment)
      ? backend
        ? syncBackendConfig(deployment)
        : syncFrontendConfig(deployment)
      : ``
}

const args = process.argv.slice(2)
const feDeployment = generateSync(args.shift())
const beDeployment = generateSync(args.shift(), true)
const cdDeployment = generateSync(args.shift(), true)
const ddDeployment = generateSync(args.shift(), true, `dd`)
// const pxDeployment = generateSync(args.shift(), true)
// const scDeployment = generateSync(args.shift(), true)

let syncs = ``
feDeployment && (syncs += feDeployment)
beDeployment && (syncs += beDeployment)
cdDeployment && (syncs += cdDeployment)
ddDeployment && (syncs += ddDeployment)
// pxDeployment && (syncs += pxDeployment)
// scDeployment && (syncs += scDeployment)

process.stdout.write(syncs)
