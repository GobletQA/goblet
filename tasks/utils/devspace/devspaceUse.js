const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')
const { getDevspaceContext } = require('./getDevspaceContext')

/**
 * Runs devspace use command passing in the configured namespace and kube-context
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceUse = async (params = noOpObj) => {
  const [__, namespace] = getDevspaceContext(params)
  return await devspace([`use`, `namespace`, namespace], params)
}

module.exports = {
  devspaceUse,
}
