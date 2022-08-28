import { command } from '../process/command'
import { noPropArr, noOpObj } from '@keg-hub/jsutils'
import { getDevspaceContext } from '../devspace/getDevspaceContext'

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

export const helm = async (
  args:string[] = noPropArr,
  opts:Record<any, any> = noOpObj,
  params:Record<any, any> = noOpObj
) => {
  const contextArgs = await getDevspaceContext(params)
  // Get the helm command, so we can add it before the namespace add
  const cmd = args.shift()
  
  const cmdArgs = [
    cmd,
    ...args,
    // Add the active namespace where helm should run the command
    ...contextArgs,
  ]

  // console.log([`helm`, ...cmdArgs].join(' '))

  return await helmCmd(cmdArgs, opts, params)
}


helm.upgrade = async (
  args:string[] = noPropArr,
  opts:Record<any, any> = noOpObj,
  params:Record<any, any> = noOpObj
) => {
  return await helm([
    `upgrade`,
    ...args
  ], opts)
}