/**
 * Used by devspace in the devspace.yml to dynamically forward ports for the application deployment
 * Ensures only deployed apps actually get their ports forwarded to the host
 * GB_FE_ACTIVE=goblet-frontend GB_BE_ACTIVE=goblet-backend node scripts/js/resolvePortForward.js FE BE
 */
const { exists, noPropArr } = require('@keg-hub/jsutils')
const {
  getAppConfig,
  resolveValue,
  resolveValues,
  resolveConfig,
  getEnvPrefix,
  getAppContexts,
} = require('./resolveValues')

const ePreFix = getEnvPrefix()
const config = resolveConfig()


const getPort = (port, envs, envPrefix) => {
  return resolveValue(port, envs)
    || (envPrefix && resolveValue(`${envPrefix}_${port}`, envs))
    || port
}

const labelSelectorConfig = (selector, port) => (`
- labelSelector:
    app.kubernetes.io/component: ${selector}
  forward:
  - port: ${port}
`)

const imageSelectorConfig = (selector, port) => (`
- imageSelector: ${selector}
  forward:
  - port: ${port}
`)

const generateLabelSelector = ({ deployment, port }) => {
  return Boolean(deployment) && exists(port) ? labelSelectorConfig(deployment, port) : ``
}

const generateImgSelector = ({ deployment, selector, port }) => {
  return Boolean(deployment) && exists(port) ? imageSelectorConfig(selector, port) : ``
}

const loopBuildPorts = ({ envs, config, deployment, envPrefix }) => {

  const ports = [
    ...(config?.portForward?.ports || noPropArr),
    ...(resolveValue(`${envPrefix}_FORWARD_PORTS`, envs) || ``).split(`,`),
    resolveValue(`${envPrefix}_FORWARD_PORT`, envs)
  ].filter(Boolean)

  if(!config || !config?.portForward || !ports.length) return ``

  const [generator, selector] = config?.portForward?.selector === `image`
    ? [generateImgSelector, resolveValue(`${envPrefix}_IMAGE`, envs)]
    : [generateLabelSelector, config?.portForward?.selector || deployment]

  return ports.reduce((fPorts, port) => {
    const built = generator({
      selector,
      envPrefix,
      deployment,
      port: getPort(port, envs, envPrefix),
    })
    built && (fPorts += built)

    return fPorts
  }, ``)

}


;(() => {
  
  const args = process.argv.slice(2)
  const envs = resolveValues()
  const contexts = getAppContexts(config)

  const portForward = args.reduce((acc, prefix) => {
    const envPrefix = `${ePreFix}${prefix}`
    const deployment = process.env[`${envPrefix}_ACTIVE`]
    if(!deployment) return

    const appConf = getAppConfig({ prefix, config, contexts })

    const builtPorts = loopBuildPorts({
      envs,
      envPrefix,
      deployment,
      config: appConf
    })

    builtPorts && (acc += builtPorts)

    return acc
  }, ``)

  process.stdout.write(portForward)

})()

