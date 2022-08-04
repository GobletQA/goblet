const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')
const { getDeployments } = require('./getDeployments')

/**
 * Runs the devspace purge command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspacePurge = async (params = noOpObj) => {
  const { context, skip, ...cmdParams } = params

  const cmdArgs = []
  params.dependencies && cmdArgs.push(`--all`)

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(context, skip, params.env)
  deployments && cmdArgs.push(`--deployments`, deployments)

  return await devspace([`purge`, ...cmdArgs], cmdParams)
}

module.exports = {
  devspacePurge,
}
