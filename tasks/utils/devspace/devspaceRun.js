const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')

/**
 * Runs the devspace run command, passing in the command name as an argument
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceRun = async (params = noOpObj) => {
  const { cmd } = params
  return await devspace([`run`, cmd], params)
}

module.exports = {
  devspaceRun,
}
