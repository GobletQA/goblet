import type { TTask } from '../../types'
import { devspace } from '../../utils/devspace/devspace'

/**
 * Run the devspace enter command to attach to a running pod
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
const attachAct = async ({ params }) => {
  return await devspace.enter(params)
}

export const attach:TTask = {
  name: `attach`,
  action: attachAct,
  alias: [`enter`, `att`],
  example: `pnpm task devspace attach <options>`,
  description: `Calls the pnpm devspace enter command to attach to the running pod`,
  options: {
    context: {
      example: `--context app`,
      alias: [`ctx`, `name`, `type`, `deployment`, `deploy`, `selector`],
      description: `Name of the running app to attach to relative to devspace deployments`,
    },
    log: {
      type: `boolean`,
      description: `Log the devspace command to be run`,
    },
  },
}