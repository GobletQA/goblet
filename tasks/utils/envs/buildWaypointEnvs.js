const { addEnv } = require('./addEnv')
const { setNodePath } = require('./setNodePath')
const { buildPWEnvs } = require('@gobletqa/testify/utils/buildPWEnvs')

/**
 * Waypoint specific ENVs to add to the current process
 * Uses the passed in params and browser to set the values
 * Automatically adds to the current process
 * 
 * @param {Object} env - Object that holds the Envs
 * @param {string} browser - Name of the browser the ENVs relate to
 * @param {Object} params - Options passed from the task parsed into an Object with args-parse
 * 
 * @returns {Object} - env object with the ENVs added
 */
const buildWaypointEnvs = (browser, goblet, params, type) => {
  const env = buildPWEnvs({...params, browser}, {}, false)

  // TODO: Update to use the GOBLET_APP_URL
  // Normalize between GOBLET_APP_URL
  addEnv(env, 'GOBLET_TEST_TYPE', type)
  addEnv(env, 'GOBLET_APP_URL', params.appUrl)
  addEnv(env, 'GOBLET_CONFIG_BASE', params.base)
  addEnv(env, 'GOBLET_BROWSER_LAUNCH_TYPE', params.launchType)
  addEnv(env, 'APP_ROOT_PATH', params.base || goblet.paths.repoRoot)

  // Set the NODE_PATH env, defaults setting it to /goblet/app/node_modules
  setNodePath(env, true)

  return {env}
}

module.exports = {
  buildWaypointEnvs
}