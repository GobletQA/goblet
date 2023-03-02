import { Logger } from '@keg-hub/cli-utils'
import { exists, isNum, noOpObj } from '@keg-hub/jsutils'

type TExitStatus = {
  code?:number
  event?:string,
  message?:string
}

let eventExitStatus:TExitStatus = noOpObj as TExitStatus

/**
 * Returns the status of eventExitStatus
 *
 */
export const getEventExitCode = () => {
  return eventExitStatus
}

/**
 * Error handler called when yarn command fails
 *
 */
export const onProcessExit = (
  repoName:string,
  exitCode:number,
  message:string
) => {
  repoName && message && Logger.error(`\n[ ${repoName} ] - ${message}\n`)

  process.exit(exitCode)
}

/**
 * Helper to automatically add exit listeners to the current process
 * Allows exiting the process in the middle of the task being run
 *
 */
export const addExitEvents = () => {
  Array.from([
    `exit`,
    `SIGINT`,
    `SIGHUP`,
    `SIGTERM`,
    `uncaughtException`
  ]).map((event) =>
    process.on(event, (type, exitCode) => {
      !exists(eventExitStatus.code) &&
        (eventExitStatus = {
          event,
          code: isNum(type) ? type : exitCode,
          message: `Process exit from event: ${event}`,
        })
    })
  )
}
