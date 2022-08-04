const { appRoot } = require('../../paths')
const { loopRepos } = require('./loopRepos')
const { Logger, yarn } = require('@keg-hub/cli-utils')
const { contextInLocation } = require('./contextInLocation')
const { validatePackageCmd } = require('./validatePackageCmd')
const { rootTasks, forceExitEvents } = require('../../constants')
const { deepMerge, noOpObj, ensureArr } = require('@keg-hub/jsutils')
const {
  addExitEvents,
  onProcessExit,
  getEventExitCode,
} = require('../process/processExit')

const logFailedTask = (repoName, cmdStr) => {
  Logger.log(
    Logger.colors.yellow(`[${repoName}]`),
    `Skipping command ${Logger.colors.red(cmdStr)}, because a previous command failed.\n`
  )
}

/**
 * Runs a yarn commands for a repo based on the passed in location
 * @type {function}
 * @public
 * @throws
 * @param {Array<string>} commands - yarn commands to run
 * @param {Object} [options={}] - Options to pass on to the spawned child process
 * @param {string} [options.message] - Message to render if the process fails
 * @param {string|Array<string>} [options.context] - Name or names of repo to run command on
 * @param {boolean} [options.log] - Should log the command output
 *
 * @returns {Array<Promise>} - Exit events from each command run on a repo
 */
const loopYarnCmds = async (commands, options, repoName, location) => {
  const { env, log, message, exitOnError = true, ...cmdOpts } = options
  const isRoot = location === appRoot
  const exitEvents = []
  let failedCmd

  await commands.reduce(async (toResolve, cmd) => {
    const lastCmdExit = await toResolve
    cmd = ensureArr(cmd)
    const cmdStr = cmd.join(' ').trim()

    // Ensure the script exists before running command at location
    if (!validatePackageCmd(repoName, location, cmd))
      return Logger.label(
        `[${repoName}]`,
        `Skipping - Script ${Logger.colors.brightYellow(cmd.join(' '))} does not exist.\n`
      )

    if (isRoot && !rootTasks.includes(cmdStr)) return null

    if (lastCmdExit || failedCmd) {
      failedCmd = true
      return logFailedTask(repoName, cmdStr)
    }

    Logger.label(`[${repoName}]`, `Running - yarn ${Logger.colors.brightYellow(cmdStr)}`)
    const exitMsg = message || `Failed running yarn ${cmdStr}`

    // Execute the yarn command on the current repo
    const exitCode = await yarn(cmd, deepMerge({ env: process.env }, cmdOpts), location)

    // Get any event exit codes that may have happened durning the yarn cmd run
    const eventExitCode = getEventExitCode()
    const hasExitCode = exitCode || eventExitCode.code
    const forceExit = forceExitEvents.includes(eventExitCode.event)

    exitEvents.push({
      repo: repoName,
      command: cmdStr,
      exitCode: hasExitCode,
    })

    if (!forceExit && (!exitOnError || !hasExitCode))
      return exitCode || eventExitCode.code

    forceExit && Logger.label(`\n\n[Task Kill]`, `Force exiting task...\n`)

    onProcessExit(repoName, hasExitCode, log && (eventExitCode.message || exitMsg))
  }, Promise.resolve())

  return exitEvents
}

/**
 * Runs a yarn command for all the repos in the repos folder
 * @type {function}
 * @public
 * @throws
 * @param {Array<string>} commands - yarn commands to run
 * @param {Object} [options={}] - Options to pass on to the spawned child process
 * @param {string} [options.message] - Message to render if the process fails
 * @param {string|Array<string>} [options.context] - Name or names of repo to run command on
 * @param {boolean} [options.log] - Should log the command output
 * @param {Function} - handle exit code logic
 *
 * @returns {Array<Promise>} - Exit code from each repo
 */
const loopRun = async (commands, options = noOpObj) => {
  addExitEvents()
  commands = ensureArr(commands)

  const { context, withRoot, singleContext, ...yarnCmdOpts } = options

  let hasRunContext = false

  const repoExitEvents = await loopRepos(async (repoName, location) => {
    // Ensure the repo should run the yarn command
    if (!contextInLocation(context, location)) return null

    // If singleContext is set and hasRunContext has been set
    // Then return, to ensure we only run one context
    if (singleContext && hasRunContext)
      return Logger.warn(
        `[Warning] Task should be run with a single context but multiple were found`
      )

    // Update has run context to ensure we only run one
    // This is used in cases where the task being run does not immediately exit
    hasRunContext = true

    return await loopYarnCmds(commands, yarnCmdOpts, repoName, location)
  }, withRoot || context.includes(appRoot))

  return repoExitEvents
}

module.exports = {
  loopRun,
}
