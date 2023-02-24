/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 */

const {
  getEnvPrefix,
  resolveValues,
} = require('./resolveValues')

const ePreFix = getEnvPrefix()


const syncBE = (deployment) => {
  const port = process.env.GB_BE_PORT || resolveValues().GB_BE_PORT

  return (`
goblet-backend:
  labelSelector:
    app.kubernetes.io/component: ${deployment}
  sync:
  - path: ../:/app
    printLogs: true
    disableDownload: true
    initialSync: mirrorLocal
    waitInitialSync: true
    excludePaths:
    - '**'
    - '.*'
    - '!/configs'
    - '!/container'
    - 'container/scripts'
    - 'container/.devspace'
    - 'container/templates'
    - '!/repos/backend'
    - '!/repos/conductor'
    - '!/repos/screencast'
    - '!/repos/shared'
    - '!/repos/workflows'
    - 'node_modules'
    - 'node_modules/**'
    - '/repos/backend/dist'
    - '/repos/conductor/dist'
    - '/repos/screencast/dist'
    - '/repos/shared/dist'
    - '/repos/workflows/dist'
  ports:
    - port: "${port}:${port}"
  logs: {}
  `)
}


const syncSc = (deployment) => {
  const port = process.env.GB_SC_PORT || resolveValues().GB_SC_PORT
  return (`
goblet-screencast:
  labelSelector:
    app.kubernetes.io/component: ${deployment}
  sync:
  - path: ../:/app
    printLogs: true
    disableDownload: true
    initialSync: mirrorLocal
    waitInitialSync: true
    excludePaths:
    - '**'
    - '.*'
    - '!/configs'
    - '!/container'
    - 'container/scripts'
    - 'container/.devspace'
    - 'container/templates'
    - '!/repos/screencast'
    - '!/repos/shared'
    - '!/repos/testUtils'
    - '!/repos/workflows'
    - '!/tasks'
    - '/repos/screencast/dist'
    - '/repos/shared/dist'
    - '/repos/testUtils/dist'
    - '/repos/workflows/dist'
  ports:
    - port: "${port}:${port}"
  logs: {}
  `)
}

const syncMethods = {
  [`goblet-backend`]: syncBE,
  [`goblet-screencast`]: syncSc,
}

const syncs = () => {
  const slice =  process.argv.slice(2)
  if (!slice.length) return 'null'

  const services = slice.reduce((acc, prefix) => {
    const envPrefix = `${ePreFix}${prefix}`
    const deployment = process.env[`${envPrefix}_ACTIVE`]
    acc += deployment ? syncMethods[deployment](deployment) : ``

    return acc
  }, ``)

  return services.length ? services : `null`
}

process.stdout.write(syncs())
