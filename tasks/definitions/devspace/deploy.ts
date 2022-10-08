import { getNpmToken } from '../../utils/envs'
import { devspace } from '../../utils/devspace/devspace'
import { setPullPolicy } from '../../utils/helpers/setPullPolicy'

/**
 * Start devspace environment
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
const deployAct = async ({ params }) => {
  const { pull } = params

  setPullPolicy(pull)

  getNpmToken()
  return await devspace.deploy(params)
}

export const deploy = {
  name: 'deploy',
  action: deployAct,
  example: 'yarn task deploy <options>',
  description: 'Calls the yarn devspace deploy command',
  options: {
    context: {
      type: `array`,
      example: `--context app1,app2`,
      alias: [`ctx`, `name`],
      description: `Contexts or names of apps to be deployed`,
    },
    skip: {
      type: `array`,
      alias: [`bypass`],
      example: `--skip proxy`,
      description: `Contexts or names of apps NOT to be started`,
    },
    force: {
      type: `boolean`,
      description: `Force deployments`,
    },
    log: {
      type: `boolean`,
      description: `Log the devspace command to be run`,
    },
  },
}