const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')
const { getCmdOptions } = require('./getCmdOptions')
const { devspaceRunning } = require('./devspaceRunning')

/**
 * Flags for the devspace dev command relative to the task definition options
 */
const flags = {
  build: '-b',
  debug: `--debug`,
}

/**
 * Keys relative to Values for the devspace build command pulled from the task definition options
 * @type {Array}
 */
const values = ['deployments']

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 * @param {Object} daemonOpts - Options for starting devspace as a background daemon
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceStart = async (params = noOpObj, daemonOpts = noOpObj) => {
  const cmdArgs = getCmdOptions(params, flags, values)

  /**
   * Check if devspace is already running
   * If it is, and build is not set, then skip the deploy process
   * And only setup the port-forwarding and file syncing
   */
  const isRunning = await devspaceRunning(params)
  isRunning && !params.build && cmdArgs.push(`--skip-pipeline`)

  // Add the daemon back the the params for the devspace dev command
  return await devspace([`dev`, ...cmdArgs], { ...params, ...daemonOpts })
}

module.exports = {
  devspaceStart,
}
