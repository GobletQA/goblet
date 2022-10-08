import { devspace } from '../../utils/devspace/devspace'

/**
 * Log the output of a running kubernetes pod
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
const logOutput = async ({ params }) => {
  return await devspace.logs(params)
}

export const log = {
  name: 'log',
  alias: ['logs', 'lg'],
  action: logOutput,
  example: 'yarn task devspace log <options>',
  description: 'Calls the yarn devspace log command',
  options: {
    context: {
      example: `--context app`,
      alias: ['ctx', `name`, `type`, 'deployment', 'deploy', 'selector'],
      description: 'Name of the app to be log relative to devspace deployments',
    },
    follow: {
      default: true,
      type: 'boolean',
      alias: ['fl', 'watch'],
      description: 'Follow the logs in realtime',
    }
  },
}
