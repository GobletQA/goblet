const { limbo } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { loopRun } = require('../../utils/repos/loopRun')
const { getTaskContext } = require('../../utils/repos/getTaskContext')
const { handleExitEvents } = require('../../utils/repos/handleExitEvents')
const {
  repoTasks,
  mergeTasks,
  publishTasks,
  publishTagTasks,
} = require('../../constants')

/**
 * Runs a group of tasks on the sub-repos of Goblet-Application
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const repos = async (args) => {
  const { env, type, tag, tasks: customTasks, ...params } = args.params
  const context = await getTaskContext(args.params)

  if (context.length === 0) return Logger.info('No changed files found')

  const tasks = customTasks.length
    ? customTasks
    : type !== 'merge'
      ? [...repoTasks]
      : tag && typeof tag !== 'boolean'
        ? [...mergeTasks, [...publishTagTasks, tag]]
        : [...mergeTasks, publishTasks]

  const [loopErr, response] = await limbo(
    loopRun(tasks, {
      ...params,
      context,
      exitOnError: false,
    })
  )

  if (loopErr) {
    Logger.error(loopErr.stack)
    process.exit(1)
  }

  return handleExitEvents(response)
}

module.exports = {
  repos: {
    name: 'repos',
    alias: ['rep'],
    action: repos,
    example: 'repos',
    description: 'Calls yarn scripts script for each repo of the application',
    options: {
      context: {
        alias: ['repo'],
        description:
          'Name or names of the repos to be reposted. Provide "all" to run across all repos',
        example: '--context frontend',
      },
      tasks: {
        alias: ['task'],
        type: 'array',
        example: '--tasks format,test',
        description: 'The specific tasks to run within the context',
      },
      type: {
        example: '--type pr',
        allowed: ['pr', 'merge'],
        default: 'pr',
        description: 'Type of tasks that should be run on the repo',
      },
      silent: {
        alias: ['quiet'],
        description: 'Skipping logging the output',
        type: 'boolean',
        example: '--silent',
      },
      withRoot: {
        default: true,
        alias: ['root'],
        type: 'boolean',
        example: '--no-root',
        description: 'Include the root directory in repos task',
      },
      tag: {
        description:
          'Providing a tag to yarn publish lets you publish packages with a specific tag.',
        example: '--tag beta',
      },
      compare: {
        description:
          'The branch name that will be used in the git diff command to compare changes. Provide "head" to compare against the last commit',
        example: '--compare main',
      },
    },
  },
}
