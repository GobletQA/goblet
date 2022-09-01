const path = require('path')
const { loadConfigs } = require('@keg-hub/parse-config')
const {
  isStr,
  noOpObj,
  deepMerge,
  tryRequireSync,
} = require('@keg-hub/jsutils/src/node')

const appRoot = path.join(__dirname, `../../`)

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
 * Gets the NPM Token from the ENV or from the getNpmToken helper
 *
 * @return {string} - Found npm token
 */
const resolveNPMToken = () => {
  return process.env[`NPM_TOKEN`] || getNpmToken()
}

module.exports = {
  resolveNPMToken,
  resolveValues,
  resolveConfig,
}
