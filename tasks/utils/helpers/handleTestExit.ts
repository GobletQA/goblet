import { noPropArr } from '@keg-hub/jsutils'

/**
 * Exits the process, once the tests are complete
 * @param {Array<string|number>} exitCodes - exit code of each test in container
 * 
 * @returns the exit code sum of the executed test commands
 */
export const handleTestExit = (exitCodes = noPropArr, reportPaths=noPropArr) => {
  return exitCodes.reduce((sum, code) => sum + parseInt(code, 10), 0)
}
