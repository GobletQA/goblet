/**
 * Used by devspace in the devspace.yml to resolve dynamic values used by other scripts
 * Includes helpers so they can be reused across multiple scripts
 */

const path = require('path')
const { loadConfigs } = require('@keg-hub/parse-config')
const {
  isStr,
  noOpObj,
  deepMerge,
  tryRequireSync,
} = require('@keg-hub/jsutils/src/node')

const appRoot = path.join(__dirname, `../../../`)
const containerDir = path.join(appRoot, `container`)

const package = require(path.join(appRoot, './package.json'))
const { getNpmToken } = require(path.join(appRoot, './tasks/utils/envs/getNpmToken.js'))

/**
 * Loaded Task Config
 */
let __TASK_CONFIG
let __ENV_PREFIX
let __CONTEXTS

/**
 * Resolves the task config
 */
const resolveConfig = (opts=noOpObj) => {
  if(__TASK_CONFIG) return __TASK_CONFIG
  
  const { configPath, throwErr=true } = opts

  const configPaths = [
    configPath,
    process.env.TASK_CONFIG_PATH,
    process.env.PARSE_CONFIG_PATH,
    path.join(appRoot, `configs/tasks.config.js`),
    path.join(appRoot, `tasks.config.js`)
  ].filter(Boolean)

  const taskConfig = configPaths.reduce((found, loc) => found || isStr(loc) && tryRequireSync(loc), false)
  if(!taskConfig && throwErr){
    throw new Error(`Could not find task.config.js in the follow paths:\n${configPaths.join(`\n`)}`)
  }
  __TASK_CONFIG = taskConfig || noOpObj

  return __TASK_CONFIG
}

/**
 * Finds the workspaces ENV prefix
 * Uses `DS` if one does not exist - devspace
 */
const getEnvPrefix = (opts=noOpObj) => {
  if(!__ENV_PREFIX){
    const { apps=noOpObj } = resolveConfig(opts)
    const prefix = apps?.default?.prefix

    __ENV_PREFIX = prefix
      ? prefix[prefix.length -1] === `_`
        ? prefix
        : `${prefix}_`
      : `DS_`
  }

  return __ENV_PREFIX
}

const getAppContexts = (config=__TASK_CONFIG) => {
  config = config || resolveConfig()

  __CONTEXTS = __CONTEXTS || Object.entries(config?.apps)
    .reduce((acc, [key, data]) => {
      if(!data) return acc
      
      const name = data?.name || key
      const contexts = data?.contexts || []
      if(!contexts || !name) return acc

      const sorted = contexts.sort((a, b) => (b.length - a.length))
      const long = sorted[0]
      const short = sorted[sorted.length - 1]

      if(!long || !short) return acc

      const ref = { keys: sorted, short, long }
      acc[long.toLowerCase()] = ref
      acc[long.toUpperCase()] = ref
      acc[short.toLowerCase()] = ref
      acc[short.toUpperCase()] = ref

      return acc
    }, {})

  return __CONTEXTS
}

const getAppConfig = ({
  prefix,
  contexts=__CONTEXTS,
  config=__TASK_CONFIG,
}) => {
  config = config || resolveConfig()
  contexts = contexts || getAppContexts(config)
  const context = contexts[prefix]
  if(!context) return

  return config.apps[context?.long] || config.apps[context?.short]
}

/**
 * Gets a value form the values.yml files from passed in arguments
 * @param {Object} config - Config for the loadConfigs method
 *
 * @return {Object} - Loaded Value ENVs
 */
const resolveValues = (config=noOpObj) => {
  return loadConfigs(deepMerge({
    name: 'goblet',
    data: {package},
    locations: [appRoot],
    env: process.env.NODE_ENV || 'local',
  }, config))
}

/**
 * Gets a single value form the current environment or values.yml files from passed in key
 * @param {string} key - Name of the env to get
 * @param {Object} [values=] - Preloaded values
 *
 * @return {string|number|undefined} - Found value
 */
const resolveValue = (key, values) => (
  process.env[key] || (values || resolveValues())?.[key]
)

/**
 * Resolves all values prefixed or postfixed with the passed in args
 * @param {string} [pre] - Prefix to look for
 * @param {string} [post] - Postfix to look for
 * @param {Object} [values=] - Preloaded values
 *
 * @return {Object} - Found values matching the prefix and or postfix
 */
const resolveFixedValues = (pre, post, values) => {
  const join = {
    ...(values || resolveValues()),
    ...process.env
  }

  return Object.entries(join)
    .reduce((acc, [key, value]) => {
      (!pre || key.startsWith(pre))
        && (!post || key.endsWith(post))
        && (acc.push(value))

      return acc
    }, [])
}

/**
 * Builds the ingress host from the prefix relative to a deployment
 * i.e. goblet-backend.local.goblet.app
 * @param {string} prefix - Prefix name of the app to get the host for
 * @param {Object} [values=] - Preloaded values
 *
 * @return {string} - Resolved host with subdomain when it exists
 */
const resolveHost = (prefix, values) => {
  const ePrefix = getEnvPrefix()
  const { domains=noOpObj } = resolveConfig()
  const env = process.env.NODE_ENV || 'local'

  values = values || resolveValues()
  
  const subDomain = resolveValue(`${ePrefix}${prefix}_SUB_DOMAIN`, values)
    || resolveValue(`${ePrefix}SUB_DOMAIN`, values)

  const hostDomain = resolveValue(`${ePrefix}${prefix}_HOST_DOMAIN`, values)
    || resolveValue(`${ePrefix}HOST_DOMAIN`, values)
    || domains?.[env]?.host
    || domains?.default?.host
    || `localhost`

  const deployment = (resolveValue(`${ePrefix}${prefix}_DEPLOYMENT`, values) || ``).replace(/_/g, `-`).split(`-`).pop()

  /**
   * Build the ingress host based on the host and sub domains
   */
  return !deployment
    ? ``
    : subDomain
      ? `${subDomain}.${hostDomain}`
      : `${deployment}.${hostDomain}`
}

/**
 * Gets the NPM Token from the ENV or from the getNpmToken helper
 *
 * @return {string} - Found npm token
 */
const resolveNPMToken = () => {
  return process.env[`NPM_TOKEN`] || getNpmToken()
}

module.exports = {
  appRoot,
  containerDir,
  resolveHost,
  getEnvPrefix,
  resolveConfig,
  resolveNPMToken,
  resolveValue,
  resolveValues,
  getAppConfig,
  getAppContexts,
  resolveFixedValues,
}
