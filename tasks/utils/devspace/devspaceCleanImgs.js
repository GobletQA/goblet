const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')

/**
 * Runs the devspace cleanup images command, to remove unused images
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceCleanImgs = async (params = noOpObj) => {
  return await devspace([`cleanup`, `images`], params)
}

module.exports = {
  devspaceCleanImgs,
}
