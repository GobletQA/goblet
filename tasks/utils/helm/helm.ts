import { command } from '../process/command'

/**
 * Runs a kubectl command and returns the output
 * Exits the process if the devspace command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - kubectl command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const helmCmd = command(`helm`)

export const helm = async (args:string[], opts:Record<any, any>) => {
  return await helmCmd(args, opts)
}