import { exists, noPropArr, toInt } from '@keg-hub/jsutils'

/**
 * Exits the process, once the tests are complete
 * @param {Array<string|number>} exitCodes - exit code of each test in container
 * 
 * @returns the exit code sum of the executed test commands
 */
export const handleTestExit = (exitCodes = noPropArr, reportPaths=noPropArr) => {
  const result = exitCodes.reduce((sum, code) => {
    return !exists(code) ? sum : sum + toInt(code)
  }, 0)

  return result > 0 ? 1 : 0
}
