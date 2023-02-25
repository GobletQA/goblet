/**
 * Used by devspace in the devspace.yml to generate file-syncing for the application deployments
 * Ensures only deployed apps actually get a sync created
 * To test run
 *   * `GB_BE_ACTIVE=goblet-backend node -r esbuild-register container/scripts/ds/resolveDev.js BE SC`
 */

const {
  getAppConfig,
  getEnvPrefix,
  resolveValue,
  resolveConfig,
  resolveValues,
  getAppContexts,
} = require('./resolveValues')

const config = resolveConfig()
const ePreFix = getEnvPrefix()


const generateList = (list=[]) => {
  return list.reduce((acc, item) => `${acc}      - '${item}'\n`, ``).trim()
}

const getPort = (port, envs, envPrefix) => {
  return resolveValue(port, envs)
    || (envPrefix && resolveValue(`${envPrefix}_${port}`, envs))
    || port
}

const loopBuildPorts = (config) => {
  const { envs, portForward, envPrefix } = config

  const ports = [
    ...(portForward?.ports || []),
    ...(resolveValue(`${envPrefix}_FORWARD_PORTS`, envs) || ``).split(`,`),
    resolveValue(`${envPrefix}_FORWARD_PORT`, envs)
  ].filter(Boolean)


  if(!config || !portForward || !ports.length) return ``

  const built = ports.reduce((fPorts, port) => {
    const found = getPort(port, envs, envPrefix)
    found && (fPorts += `    - port: "${found}:${found}"\n`)

    return fPorts
  }, ``)

  return built ? `ports: \n${built}`.trimEnd() : ``
}

const buildConfig = (deployment, config) => {
  const { sync, sharedIgnore, excludePaths } = config
  const ports = loopBuildPorts(config)

  return (`${deployment}:
  labelSelector:
    app.kubernetes.io/component: ${deployment}
  logs: {}
  sync:
  - path: ${sync.localSubPath}:${sync.containerPath}
    printLogs: true
    waitInitialSync: true
    initialSync: ${sync.initialSync}
    disableDownload: ${sync.disableDownload}
    excludePaths:
      ${excludePaths}
      ${sharedIgnore}
  ${ports}
  `).trimEnd()
}

const resolveDev = () => {
  const envs = resolveValues()
  const sharedIgnore = generateList(config?.apps?.default?.sync?.excludePaths)
  const contexts = getAppContexts(config)
  
  const slice =  process.argv.slice(2)
  if (!slice.length) return 'null'

  const services = slice.reduce((acc, prefix) => {
    const envPrefix = `${ePreFix}${prefix}`
    const deployment = process.env[`${envPrefix}_ACTIVE`]
    
    const appConf = getAppConfig({ prefix, config, contexts })

    deployment
      && acc.push(
          buildConfig(deployment, {
            ...config?.apps?.default,
            ...appConf,
            envs,
            prefix,
            envPrefix,
            sharedIgnore,
            excludePaths: generateList(appConf?.sync?.excludePaths),
            sync: { ...config?.apps?.default.sync, ...appConf.sync }
          })
        )

    return acc
  }, [])

  return services.length ? services.join(`\n`) : `null`
}

process.stdout.write(resolveDev())
