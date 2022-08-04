const path = require('path')
const { get, isArr } = require('@keg-hub/jsutils')
const { Logger, error } = require('@keg-hub/cli-utils')

/**
 * Checks if a command exists inside of a packge.json config file
 * Expects the location to contain a package.json file
 * @throws
 * @function
 * @param {string} context - Name of the context that is being checked
 * @param {string} location - Folder location of the context being checked
 * @param {string} cmd - Command to check if it exists
 *
 * @returns {boolean} - True of the command exists
 */
const validatePackageCmd = (context, location, cmd) => {
  cmd = isArr(cmd) ? cmd[0] : cmd

  try {
    const config = require(path.join(location, `package.json`))
    return Boolean(get(config, ['scripts', cmd]))
  }
  catch (err) {
    Logger.error(`[${context}] - Error loading package.json file`)
    Logger.log(`  * Ensure the json file at ${location} is valid.\n`)

    error.throwExitError(error)
  }
}

module.exports = {
  validatePackageCmd,
}
