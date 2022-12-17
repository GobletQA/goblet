import type { TTask, TTaskActionArgs, TTaskParams } from '../../types'

import { clean as cleanTask } from './clean'
import { getNpmToken } from '../../utils/envs'
import { devspace } from '../../utils/devspace/devspace'
import { getLongContext } from '../../utils/helpers/contexts'
import { setPullPolicy } from '../../utils/helpers/setPullPolicy'
import { getDeployments } from '../../utils/devspace/getDeployments'

const setStartEnvs = (params:TTaskParams) => {
  const { install, pull, build } = params

  setPullPolicy(pull)

  /**
   * Set the BUILD_LOCAL_IMAGE env based on the passed in build option
   * This determines if the docker images should be built locally or pulled from a registry
   */
  process.env.BUILD_LOCAL_IMAGE = build

  /**
   * Set the GB_NM_INSTALL env based on the passed in install option
   * Tells the corresponding app to run yarn install prior to starting
   */
  const nmInstall = getLongContext(install)

  if (nmInstall) process.env.GB_NM_INSTALL = nmInstall
}

/**
 * Start devspace environment
 * @returns {void}
 */
const startAct = async (args:TTaskActionArgs) => {
  const { params } = args

  // Extract the daemon flag so it doesn't impact other commands
  // We only want it set on the devspace start command
  const {
    skip,
    pull,
    clean,
    cache,
    watch,
    images,
    daemon,
    install,
    context,
    screencast,
    devspace:ds,
    ...altParams
  } = params
  
  clean && await cleanTask.action({
    ...args,
    params: {
      skip,
      cache,
      images,
      daemon,
      context,
      screencast,
      devspace:ds,
      env: altParams.env
    }
  })

  setStartEnvs(params)

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(context, skip, params.env)

  getNpmToken()
  return await devspace.start({
    ...altParams,
    context,
    devspace:ds,
    deployments,
  }, { daemon, watch })
}

export const start:TTask = {
  name: `start`,
  action: startAct,
  example: `yarn task devspace start <options>`,
  description: `Calls the devspace dev command`,
  options: {
    context: {
      type: `array`,
      example: `--context app1,app2`,
      alias: [`ctx`, `name`, `type`, `deployment`, `deploy`, `selector`],
      description: `Contexts or names of apps to be started`,
    },
    skip: {
      type: `array`,
      alias: [`bypass`],
      example: `--skip proxy`,
      description: `Contexts or names of apps NOT to be started`,
    },
    build: {
      default: false,
      type: `boolean`,
      description: `Build docker image before running`,
    },
    log: {
      default: false,
      type: `boolean`,
      description: `Log the devspace command to be run`,
    },
    daemon: {
      default: false,
      type: `boolean`,
      alias: [`d`, `background`, `bg`, `detach`],
      description: `Runs the devspace command in the background`,
    },
    watch: {
      default: true,
      type: `boolean`,
      description: `Watch the logs after starting the application as a daemon. Only used when "--daemon" option is "true"`,
    },
    tag: {
      env: `IMAGE_TAG`,
      example: `--tag package`,
      allowed: [`package`, `branch`, `commit`, `values`],
      description: `Name of the tag to use when pulling the docker image`,
    },
    image: {
      env: `IMAGE`,
      description: `Name of the docker image to use when starting the application`,
    },
    debug: {
      default: false,
      type: `boolean`,
      description: `Runs the devspace command in debug mode`,
    },
    profile: {
      description: `Devspace profile to use defined in the container/devspace.yml`,
    },
    install: {
      type: `string`,
      example: `--install proxy`,
      alias: [`in`, `yarn`, `nm`],
      description: `Name of the app that should run yarn install prior to starting.`,
    },
    pull: {
      example: `--pull never`,
      alias: [`pull_policy`, `pullpolicy`, `pp`],
      allowed: [`IfNotPresent`, `Always`, `Never`, `present`, `exists`],
      description: `Set the image pull policy when starting the docker container, based on kubernetes pull policy`,
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
    screencast: {
      alias: [`sc`],
      type: `boolean`,
      default: true,
      description: `Removes screencast pods while cleaning. Only valid when clean option is true`,
    },
    cache: {
      default: true,
      type: `boolean`,
      description: `Remove devspace cache. Only valid when clean option is true`,
    },
  },
}
