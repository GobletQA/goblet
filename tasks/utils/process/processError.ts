import { Logger } from '@keg-hub/cli-utils'

/**
 * Logs and error if log argument is true, then exits the current process
 * @function
 * @private
 * @exits
 *
 */
export const processError = (
  error:string,
  exitCode:number=1,
  log:boolean=true
) => {
  error && log && Logger.error(error)
  Logger.empty()

  process.exit(exitCode)
}
