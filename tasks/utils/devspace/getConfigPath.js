const path = require('path')
const { containerDir } = require('../../paths')
const { loadEnvs } = require('../envs/loadEnvs')
const { getContextValue } = require('../helpers/contexts')
const { isStr, exists, isArr } = require('@keg-hub/jsutils')
const { resolveLocalPath } = require('../helpers/resolveLocalPath')

/**
 * Checks if a custom config location is passed in and returns it
 * Otherwise returns the default config location
 * @param {Object} params - Parsed options passed to the original task
 * @param {string} params.env - Environment the task is being run in
 * @param {string} params.context - Current context for the task
 * @param {string} params.devspace - Path to a custom devspace config file
 *
 * @returns {string} - Path to the resolve devspace config file
 */
const getConfigPath = (params) => {
  const { env, devspace, context } = params

  // For some tasks, context is an array to we have to check if it's an array of 1
  const isMultiContext = isArr(context)
  const validContext = isStr(context) || isMultiContext && context.length === 1

  if(!devspace && !validContext) return path.join(containerDir, `devspace.yaml`)

  const devContext = isMultiContext ? context[0] : context
  const envs = loadEnvs({ env })

  const altConfig = isStr(devspace)
    ? devspace
    : getContextValue(devContext, envs, `DEVSPACE_CONFIG`)

  return exists(altConfig) && isStr(altConfig)
    ? resolveLocalPath(altConfig)
    : path.join(containerDir, `devspace.yaml`)
}

module.exports = {
  getConfigPath,
}
