import type { TTaskActionArgs, TTaskParams } from '../../types'

import { Logger } from '@keg-hub/cli-utils'
import { removeAction } from '../kube/remove'
import { devspace } from '../../utils/devspace/devspace'
import { cleanPm2Daemon } from '../../utils/process/command'
import { removeCacheDir } from '../../utils/devspace/removeCacheDir'

/**
 * Helper to call the kube.pod.remove method for an screencast containers
 */
const screencastRemove = async (args:TTaskActionArgs) => {
  return await removeAction({
    ...args,
    params: {
      name: true,
      context: `screencast`,
      env: args?.params?.env,
      log: args?.params?.log ?? true,
    } as TTaskParams
  })
}

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
const cleanAct = async (args:TTaskActionArgs) => {
  const { daemon, screencast, ...params } = args.params
  params.log && Logger.info(`\nCleaning Dev Environment...`)
  daemon && (await cleanPm2Daemon(`devspace-dev`, { exec: true }))

  await devspace.purge(params)
  screencast && await screencastRemove(args)

  params.images && (await devspace.cleanImgs(params))
  params.cache && (await removeCacheDir(params))

  params.log && Logger.success(`\nFinished cleaning Dev Environment\n`)
}

export const clean = {
  name: `clean`,
  action: cleanAct,
  alias: [`purge`, `stop`, `kill`],
  example: `yarn task clean <options>`,
  description: `Calls the yarn devspace clean command`,
  options: {
    context: {
      type: `array`,
      example: `--context proxy`,
      alias: [`ctx`, `name`, `type`, `deployment`, `deploy`],
      description: `Contexts or names of apps to be cleaned`,
    },
    skip: {
      type: `array`,
      alias: [`bypass`],
      example: `--skip proxy`,
      description: `Contexts or names of apps NOT to be cleaned`,
    },
    dependencies: {
      alias: [`deps`],
      type: `boolean`,
      default: true,
      description: `Include dependencies when running the clean command`,
    },
    daemon: {
      alias: [`daemons`, `pm2`],
      type: `boolean`,
      default: true,
      description: `Remove pm2 daemons when running the clean command`,
    },
    images: {
      alias: [`imgs`, `image`, `img`],
      type: `boolean`,
      default: false,
      description: `Remove images when running the clean command`,
    },
    cache: {
      type: `boolean`,
      default: true,
      description: `Remove devspace cache directory when running the clean command`,
    },
    screencast: {
      alias: [`sc`],
      type: `boolean`,
      default: true,
      description: `Manually remove screencast pods if they exists`,
    },
    log: {
      type: `boolean`,
      description: `Log the devspace command to be run`,
    },
  },
}
