/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 * Test script by running the following command
 * GB_FE_ACTIVE=goblet-frontend GB_BE_ACTIVE=goblet-backend node container/scripts/ds/resolveSync.js FE BE
 */
const { resolveConfig, getEnvPrefix, getAppContexts, getAppConfig } = require('./resolveValues')
const ePreFix = getEnvPrefix()
const config = resolveConfig()

const generateList = (list=[]) => {
  return list.reduce((acc, item) => `${acc}  - '${item}'\n`, ``).trimEnd()
}

const syncAppConfig = (deployment, config) => (`
- labelSelector:
    app.kubernetes.io/component: ${deployment}
  disableDownload: ${config.disableDownload}
  initialSync: ${config.initialSync}
  localSubPath: ${config.localSubPath}
  containerPath: ${config.containerPath}
  excludePaths:
${config.excludePaths}
${config.sharedIgnore}
`)

/**
 * Check if the app is being deploy
 * If it is, build the sync config based off the deployment
 */
const generateSync = (deployment, config) => {
  return (!deployment)
    ? ``
    : syncAppConfig(deployment, config)
}

;(() => {

  const sharedIgnore = generateList(config?.apps?.default?.sync?.excludePaths)
  const contexts = getAppContexts(config)
  const args = process.argv.slice(2)

  const syncs = args.reduce((acc, prefix) => {
    const deployment = process.env[`${ePreFix}${prefix}_ACTIVE`]
    if(!deployment) return acc

    const appConf = getAppConfig({ prefix, config, contexts })

    const built = generateSync(deployment, {
      ...config?.apps?.default?.sync,
      ...appConf?.sync,
      prefix,
      sharedIgnore,
      excludePaths: generateList(appConf?.sync?.excludePaths),
    })
    
    built && (acc += built)

    return acc
  }, ``)


  process.stdout.write(syncs)

})()
