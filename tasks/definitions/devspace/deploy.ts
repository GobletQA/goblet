import type { TTaskActionArgs, TTask } from '../../types'

import { clean as cleanTask } from './clean'
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
export const deployAct = async (args:TTaskActionArgs) => {
  const { params } = args

  // For production default to using the backend devspace config if not set
  if(params.env === `production` && !params.devspace) params.devspace = `be`

  const {
    env,
    skip,
    pull,
    clean,
    cache,
    images,
    context,
    screencast,
    devspace:ds,
  } = params

  clean && await cleanTask.action({
    ...args,
    params: {
      env,
      skip,
      cache,
      images,
      context,
      screencast,
      devspace:ds,
    }
  })

  setPullPolicy(pull)

  getNpmToken()
  return await devspace.deploy(params)
}

export const deploy:TTask = {
  name: `deploy`,
  action: deployAct,
  example: `yarn task dev deploy <options>`,
  description: `Calls the yarn devspace deploy command`,
  options: {
    context: {
      type: `array`,
      example: `--context app1,app2`,
      alias: [`ctx`, `name`],
      description: `Contexts or names of apps to be deployed`,
    },
    devspace: {
      alias: [`dsp`, `ds`, `dev`],
      example: `--devspace staging`,
      // Deployments should always default to using the backend devspace config
      default: `container/devspace.yaml`,
      description: `Optional filepath for devspace.yaml file`,
    },
    skip: {
      type: `array`,
      alias: [`bypass`],
      example: `--skip app`,
      description: `Contexts or names of apps NOT to be started`,
    },
    pull: {
      example: `--pull never`,
      alias: [`pull_policy`, `pullpolicy`, `pp`],
      allowed: [`IfNotPresent`, `Always`, `Never`, `present`, `exists`],
      description: `Set the image pull policy when starting the docker container, based on kubernetes pull policy`,
    },
    force: {
      default: true,
      type: `boolean`,
      description: `Force deployments`,
    },
    clean: {
      default: false,
      type: `boolean`,
      alias: [`cln`],
      example: `--clean`,
      description: `Cleans the deployment before deploying. Same as running the "clean" task`
    },
    images: {
      default: false,
      type: `boolean`,
      alias: [`imgs`],
      example: `--images`,
      description: `Remove all images while cleaning. Only valid when clean option is true`
    },
    cache: {
      default: true,
      type: `boolean`,
      description: `Remove devspace cache. Only valid when clean option is true`,
    },
    screencast: {
      alias: [`sc`],
      type: `boolean`,
      default: true,
      description: `Removes screencast pods while cleaning. Only valid when clean option is true`,
    },
    log: {
      alias: [`lg`],
      default: true,
      example: `--no-log`,
      description: `Verbose logging of task actions`
    }
  },
}