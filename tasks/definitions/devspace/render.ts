import type { TTask, TTaskActionArgs } from '../../types'

import { getNpmToken } from '../../utils/envs'
import { devspace } from '../../utils/devspace/devspace'
import { setDeploymentEnvs } from '../../utils/envs/setDeploymentEnvs'
import { getDeployments } from '../../utils/devspace/getDeployments'

/**
 * General devspace command the forwards the first argument on to the devspace executable
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
const renderAct = async ({ task, params }:TTaskActionArgs) => {
  setDeploymentEnvs(params.env)
    /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(params.context, params.skip, params.env)
  const cmdArgs = [
    `render`,
    `--debug`
  ]
  deployments && deployments.length && cmdArgs.push(`--deployments`, deployments)

  getNpmToken()
  return await devspace(cmdArgs, params)
}

export const render:TTask = {
  name: 'render',
  alias: ['ren', 'rdr'],
  action: renderAct,
  example: 'yarn dev render <options>',
  description: 'Calls the devspace render command',
  options: {
    context: {
      type: 'array',
      example: `--context app1,app2`,
      alias: ['ctx', `name`, `type`, 'deployment', 'deploy', 'selector'],
      description: `Contexts or names of apps to be started`,
    },
    skip: {
      type: 'array',
      alias: ['bypass'],
      example: `--skip proxy`,
      description: `Contexts or names of apps NOT to be started`,
    },
  },
}