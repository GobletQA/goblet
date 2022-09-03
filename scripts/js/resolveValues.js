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

const appRoot = path.join(__dirname, `../../`)
const containerDir = path.join(appRoot, `container`)

const package = require(path.join(appRoot, './package.json'))
const { getNpmToken } = require(path.join(appRoot, './tasks/utils/envs/getNpmToken.js'))

/**
 * Resolves the task config
 */
const resolveConfig = (configPath) => {
  const configPaths = [
    configPath,
    process.env.TASK_CONFIG_PATH,
    process.env.PARSE_CONFIG_PATH,
    path.join(appRoot, `configs/tasks.config.js`),
    path.join(appRoot, `tasks.config.js`)
  ].filter(Boolean)

  const taskConfig = configPaths.reduce((found, loc) => found || isStr(loc) && tryRequireSync(loc), false)
  if(taskConfig) return taskConfig

  throw new Error(`Could not find task.config.js in the follow paths:\n${configPaths.join(`\n`)}`)
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
  values = values || resolveValues()
  
  const subDomain = resolveValue(`GB_${prefix}_SUB_DOMAIN`, values)
    || resolveValue(`GB_SUB_DOMAIN`, values)

  const hostDomain = resolveValue(`GB_${prefix}_HOST_DOMAIN`, values)
    || resolveValue(`GB_HOST_DOMAIN`, values)
    || `local.gobletqa.app`

  const deployment = (resolveValue(`GB_${prefix}_DEPLOYMENT`, values) || ``).replace(/_/g, `-`).split(`-`).pop()

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
  resolveConfig,
  resolveNPMToken,
  resolveValue,
  resolveValues,
  resolveFixedValues,
}
