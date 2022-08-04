const { command } = require('../process/command')
const { getConfigPath } = require('./getConfigPath')
const { ensureArr, noOpObj } = require('@keg-hub/jsutils')
const { getDevspaceContext } = require('./getDevspaceContext')

/**
 * Finds the index of the last argument with a --, and appends the default devspace arguments
 * @function
 * @public
 * @param {string|Array<string>} cmd - Devspace command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Array<string>} - Updated cmd arguments with the defaults added
 */
const addDefaultArgs = async (cmd, params) => {
  const contextArgs = await getDevspaceContext(params)

  /**
   * Ensure the cmd is an array, and find the last argument with a `-`
   * Then use that index as the location to add the default arguments
   */
  let insertIdx
  const cmdArr = ensureArr(cmd).map((item, idx) => {
    insertIdx = item.startsWith(`-`) ? idx : insertIdx
    return item
  })

  insertIdx = insertIdx || cmdArr.length

  const defArgs = [
    `--config`,
    getConfigPath(params.config),
    `--profile`,
    params.profile || params.env,
  ]

  /** Add the default arguments at the found insertIdx */
  cmdArr.splice(insertIdx, 0, ...contextArgs, ...defArgs)

  return cmdArr
}

/**
 * Runs a devspace command and returns the output
 * Exits the process if the devspace command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - Devspace command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const devspaceCmd = command('devspace')

const devspace = async (cmd, params = noOpObj) => {
  const cmdArgs = await addDefaultArgs(cmd, params)

  return await devspaceCmd(cmdArgs, params)
}

module.exports = {
  devspace,
}
