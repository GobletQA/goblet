const { Logger } = require('@keg-hub/cli-utils')
const { devspace } = require('../../utils/devspace/devspace')
const { cleanPm2Daemon } = require('../../utils/process/command')
const { removeCacheDir } = require('../../utils/devspace/removeCacheDir')

/**
 * Cleans the devspace environment and lingering images that may not be needed
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
const clean = async (args) => {
  const { daemon, ...params } = args.params
  params.log && Logger.info(`\nCleaning Dev Environment...`)
  daemon && (await cleanPm2Daemon(`devspace-dev`, { exec: true }))

  await devspace.purge(params)
  params.images && (await devspace.cleanImgs(params))
  params.cache && (await removeCacheDir(params))

  params.log && Logger.success(`\nFinished cleaning Dev Environment\n`)
}

module.exports = {
  clean: {
    name: 'clean',
    action: clean,
    alias: ['purge', 'stop', 'kill'],
    example: 'yarn task clean <options>',
    description: 'Calls the yarn devspace clean command',
    options: {
      context: {
        type: 'array',
        example: `--context proxy`,
        alias: ['ctx', `name`, `type`, 'deployment', 'deploy'],
        description: `Contexts or names of apps to be cleaned`,
      },
      skip: {
        type: 'array',
        alias: ['bypass'],
        example: `--skip proxy`,
        description: `Contexts or names of apps NOT to be cleaned`,
      },
      devspace: {
        description: 'Optional filepath for devspace.yaml file',
      },
      dependencies: {
        alias: ['deps'],
        type: 'boolean',
        default: true,
        description: 'Include dependencies when running the clean command',
      },
      daemon: {
        alias: ['daemons', 'pm2'],
        type: 'boolean',
        default: true,
        description: 'Remove pm2 daemons when running the clean command',
      },
      images: {
        alias: ['imgs', 'image', 'img'],
        type: 'boolean',
        default: false,
        description: 'Remove images when running the clean command',
      },
      cache: {
        type: 'boolean',
        default: true,
        description: 'Remove devspace cache directory when running the clean command',
      },
      log: {
        type: 'boolean',
        description: 'Log the devspace command to be run',
      },
    },
  },
}
