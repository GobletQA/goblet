/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 */

const sharedIgnored = `
  - /repos/traceViewer
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

const syncBackendConfig = (deployment, extraIgnore) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: true
  initialSync: mirrorLocal
  localSubPath: ../
  containerPath: /goblet/app
  uploadExcludePaths:
  - /repos/admin
  - /repos/frontend
  ${sharedIgnored}
`)


/**
 * Check if the app is being deploy
 * If it is, build the sync config based off the deployment
 */
const generateSync = (isActiveEnv, backend) => {
  const deployment = process.env[isActiveEnv]
  return Boolean(deployment)
    ? backend
      ? syncBackendConfig(deployment)
      : syncFrontendConfig(deployment)
    : ``
}

const args = process.argv.slice(2)
const feDeployment = generateSync(args.shift())
const beDeployment = generateSync(args.shift(), true)
const cdDeployment = generateSync(args.shift(), true)
// const pxDeployment = generateSync(args.shift(), true)
// const scDeployment = generateSync(args.shift(), true)

let syncs = ``
feDeployment && (syncs += feDeployment)
beDeployment && (syncs += beDeployment)
cdDeployment && (syncs += cdDeployment)
// pxDeployment && (syncs += pxDeployment)
// scDeployment && (syncs += scDeployment)

process.stdout.write(syncs)
