const { appRoot } = require('../../paths')
const { command } = require('../process/command')
const { deepMerge, noOpObj } = require('@keg-hub/jsutils')

/**
 * Runs a git command and returns the output
 * Exits the process if the git command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - Git command to run split as an array
 * @param {Object} opts - Options to pass to the child process
 *
 * @returns {Void}
 */
const gitCmd = command('git')
const git = (cmd, params = noOpObj) =>
  gitCmd(cmd, deepMerge({ exec: true, cwd: appRoot }, params))

/**
 * Gets the options passed to the spawned child-process
 * @function
 * @param {string} output - Response from the git command that's been run
 * @param {string} [compare=main] - Branch to compare against. Defaults to main
 *
 * @returns {Array} - Cleaned files list split into an array
 */
const cleanResult = (output, compare) => {
  const files = output
    .trim()
    .split(/\n|\r|\r\n/)
    .filter((line) => line)

  return compare ? files.filter((location) => !compare.includes(location)) : files
}

module.exports = {
  git,
  cleanResult,
}
