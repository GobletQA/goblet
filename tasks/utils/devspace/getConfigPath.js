const path = require('path')
const { error } = require('@keg-hub/cli-utils')
const { containerDir } = require('../../paths')
const { loadEnvs } = require('../envs/loadEnvs')
const { isStr, exists, isArr } = require('@keg-hub/jsutils')
const { resolveLocalPath } = require('../helpers/resolveLocalPath')
const { getContextValue, getLongContext } = require('../helpers/contexts')

/**
 * Try to resolve the path to the devspace config from the passed in option param
 * If not found throws an error
 */
const resolveFromDSParam = (params) => {
  const { env, devspace } = params
  const envs = loadEnvs({ env })

  !isStr(devspace)
    && error.throwError(`The devspace option ${devspace} is not a valid config path`)

  const lgCtx = getLongContext(devspace)

  // If no long context, then consider passed in devspace param a path
  if(!lgCtx) return resolveLocalPath(devspace)
  
  // Get the context value path from the long context
  const altConfig = getContextValue(lgCtx, envs, `DEVSPACE_CONFIG`)

  return !isStr(altConfig)
    ? error.throwError(`Could not find devspace config at path ${devspace}`)
    : resolveLocalPath(altConfig)
}

/**
 * Try to resolve the path to the devspace config from the passed in context
 * If not found, uses the default devspace config
 */
const resolveFromContext = (params) => {
  const { env, context } = params
  if(!context) return path.join(containerDir, `devspace.yaml`)

  const envs = loadEnvs({ env })

  // For some tasks, context is an array, so we use the first context by default
  const devContext = isArr(context) ? context[0] : context
  const altConfig = getContextValue(devContext, envs, `DEVSPACE_CONFIG`)

  return exists(altConfig) && isStr(altConfig)
    ? resolveLocalPath(altConfig)
    : path.join(containerDir, `devspace.yaml`)
}

/**
 * Checks if a custom config location is passed in and returns it
 * Otherwise returns the default config location
 * @param {Object} params - Parsed options passed to the original task
 * @param {string} params.env - Environment the task is being run in
 * @param {string} [params.context] - Current context for the task
 * @param {string} [params.devspace] - Path to a custom devspace config file
 *
 * @returns {string} - Path to the resolved devspace config file
 */
const getConfigPath = (params) => {
  return params.devspace
    ? resolveFromDSParam(params)
    : resolveFromContext(params)
}



module.exports = {
  getConfigPath,
}
