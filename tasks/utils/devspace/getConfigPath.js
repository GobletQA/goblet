const path = require('path')
const { containerDir } = require('../../paths')
const { isStr, exists } = require('@keg-hub/jsutils')

/**
 * Checks if a custom config location is passed in and returns it
 * Otherwise returns the default config location
 * @param {string} configLoc - Path to a custom devspace config file
 *
 * @returns {string} - Path to the resolve devspace config file
 */
const getConfigPath = (configLoc) => {
  return exists(configLoc) && isStr(configLoc)
    ? path.resolve(configLoc)
    : path.join(containerDir, `devspace.yaml`)
}

module.exports = {
  getConfigPath,
}
