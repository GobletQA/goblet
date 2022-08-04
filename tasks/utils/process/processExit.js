const { Logger } = require('@keg-hub/cli-utils')
const { exists, isNum, noOpObj } = require('@keg-hub/jsutils')

let eventExitStatus = noOpObj

/**
 * Returns the status of eventExitStatus
 * @type {function}
 * @public
 *
 * @returns {number} eventExitStatus - The error code returned from a child process
 */
const getEventExitCode = () => {
  return eventExitStatus
}

/**
 * Error handler called when yarn command fails
 * @type {function}
 * @public
 * @exits
 * @param {number} exitCode - The error code returned from the yarn command
 * @param {string} repoName - Name of the repo that failed
 * @param {string} message - Error message to display
 *
 */
const onProcessExit = (repoName, exitCode, message) => {
  repoName && message && Logger.error(`\n[ ${repoName} ] - ${message}\n`)

  process.exit(exitCode)
}

/**
 * Helper to automatically add exit listeners to the current process
 * Allows exiting the process in the middle of the task being run
 * @type {function}
 * @private
 *
 * @returns {void}
 */
const addExitEvents = () => {
  Array.from(['exit', 'SIGINT', `SIGHUP`, 'SIGTERM', 'uncaughtException']).map((event) =>
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

module.exports = {
  addExitEvents,
  onProcessExit,
  getEventExitCode,
}
