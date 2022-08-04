const { devspace } = require('./devspace')
const { noOpObj } = require('@keg-hub/jsutils')
const { getLabelSelector } = require('./getLabelSelector')
/**
 * Runs the sync script to sync local and container files
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
const devspaceSync = async (params = noOpObj) => {
  const { selector, args } = getLabelSelector(params)

  const { local, container } = params
  const cmdArgs = [`sync`, `--local-path=${local}`, `--container-path=${container}`]

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}
module.exports = {
  devspaceSync,
}
