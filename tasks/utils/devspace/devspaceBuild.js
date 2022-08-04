const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')
const { getCmdOptions } = require('./getCmdOptions')

/**
 * Flags for the devspace build command pulled from the task definition options
 * @type {Object}
 */
const flags = {
  force: '-b',
  skip: '--skip-push',
}

/**
 * Keys relative to Values for the devspace build command pulled from the task definition options
 * @type {Array}
 */
const values = ['tag']

/**
 * Runs the devspace build command - Builds all defined images
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceBuild = async (params = noOpObj) => {
  return await devspace([`build`, ...getCmdOptions(params, flags, values)], params)
}

module.exports = {
  devspaceBuild,
}
