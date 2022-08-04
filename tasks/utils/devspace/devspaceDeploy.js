const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceDeploy = async (params = noOpObj) => {
  return await devspace([`deploy`], params)
}

module.exports = {
  devspaceDeploy,
}
