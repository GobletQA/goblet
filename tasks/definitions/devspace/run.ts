import { containerDir } from'../../paths'
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
const runAct = async ({ params }) => {
  /**
   * Devspace requires the command be run from the same dir as the devspace.yml file
   * Seems to be a bug, but it's the only way it works even with the devspace --config argument set
   */
  return await devspace.run({ ...params, cwd: containerDir })
}

export const run = {
  name: 'run',
  alias: ['run', 'cmd'],
  action: runAct,
  example: 'yarn task devspace run <options>',
  description: 'Calls the devspace run command',
  options: {
    cmd: {
      required: true,
      alias: ['context', 'command'],
      description: 'Name of the command to be run from the container/devspace.yml file',
    },
    context: {
      example: `--context app`,
      alias: ['ctx', `name`, `type`, 'deployment', 'deploy', 'selector'],
      description: `Context or name of devspace app to be run`,
    },
    devspace: {
      description: 'Optional filepath for devspace.yaml file',
    },
    log: {
      type: 'boolean',
      description: 'Log the devspace command to be run',
    },
  },
}
