const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')
const { getLabelSelector } = require('./getLabelSelector')

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceEnter = async (params = noOpObj) => {
  const cmdArgs = [`enter`]
  const { selector, args } = getLabelSelector(params)

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}

module.exports = {
  devspaceEnter,
}
