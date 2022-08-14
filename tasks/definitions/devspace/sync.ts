import { devspace } from '../../utils/devspace/devspace'

/**
 * Runs the sync script to sync local and container files
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
const syncAct = async (args) => {
  return await devspace.sync(args.params)
}

export const sync = {
  name: 'sync',
  action: syncAct,
  example: 'yarn task sync <options>',
  description: 'Calls the yarn devspace sync command',
  options: {
    context: {
      required: true,
      example: `--context app`,
      alias: ['ctx', `name`, `type`, 'deployment', 'deploy', 'selector'],
      description: 'Context for the task being run relative to the devspace pods',
    },
    log: {
      default: false,
      type: 'boolean',
      description: 'Log the devspace command to be run',
    },
    local: {
      required: true,
      alias: ['local'],
      description: 'Path on local machine to sync',
      example: '--local=/path/to/folder',
    },
    container: {
      required: true,
      alias: ['container'],
      description: 'Path on container to sync',
      example: '--container=/path/to/folder',
    },
  },
}
