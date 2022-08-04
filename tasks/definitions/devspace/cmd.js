const { getNpmToken } = require('../../utils/envs')
const { error } = require('@keg-hub/cli-utils')
const { devspace } = require('../../utils/devspace/devspace')
const { setDeploymentEnvs } = require('../../utils/envs/setDeploymentEnvs')
const { getDeploymentOpts } = require('../../utils/devspace/getDeploymentOpts')

/**
 * General devspace command the forards the first argument on to the devspace executable
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const command = async ({ task, params }) => {
  const cmd = process.argv.slice(3).shift()

  !task.alias.includes(cmd) &&
    error.throwError(
      `Command ${cmd} is not a valid devspace command. Must be one of ${task.alias.join(
        ' | '
      )}`
    )

  const [_, deployments, activeMap] = getDeploymentOpts(params.env)
  setDeploymentEnvs(deployments, activeMap)

  getNpmToken()
  return await devspace([cmd, `--debug`], params)
}

module.exports = {
  cmd: {
    name: 'cmd',
    alias: ['analyze', 'render', 'print', 'ui'],
    action: command,
    example: 'yarn dev <cmd> <options>',
    description: 'Calls the devspace command',
    options: {},
  },
}
