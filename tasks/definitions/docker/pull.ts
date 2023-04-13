import path from 'path'
import { containerDir } from '../../paths'
import { Logger } from '@keg-hub/cli-utils'
import { docker } from '../../utils/docker/docker'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { getNpmToken } from '../../utils/envs/getNpmToken'
import { getLongContext } from '../../utils/helpers/contexts'
import { resolveImgName } from '../../utils/docker/resolveImgName'

/**
 * Helper to parse the context, image, and tag params
 * This normalizes by checking for an image tag on the context or image
 * If found, it sets it as the passed in tag
 * @param {Object} args.params - Passed in options, converted into an object
 *
 * @returns {Object} Normalized params
 */
const resolveParams = (params) => {
  const { context, image, tag, ...rest } = params

  // If a context is set, ignore the image param
  if(context){
    const [ contName, contTag ] = context.split(`:`)
    // Use the context tag or passed in tag
    return { ...rest, tag: contTag || tag, context: contName }
  }

  // If no context and no image, just return to use the defaults
  if(!image) return params

  // Check if the image has a tag, if not use the params instead
  const [ imgName, imgTag ] = image.indexOf(`:`)
    ? image.split(`:`)
    : [image, tag]

  return {
    ...rest,
    context,
    image: imgName,
    tag: imgTag || tag,
  }
}

/**
 * Login into the docker container registry relative to the docker image name
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
const docPull = async (args) => {
  const params = resolveParams(args.params)
  const { context, env, tag, log } = params

  const envs = loadEnvs({ env })
  const token = getNpmToken()
  const allEnvs = { ...envs, NPM_TOKEN: token }

  // Get the context for the docker image being built
  // Defaults to using the `container/Dockerfile`, without `.<context>`
  const docFileCtx = getLongContext(context, 'app')

    // Get the name for the docker image being run
  const resolvedName = resolveImgName(params, docFileCtx, allEnvs)

  // Ensure we are logged into docker
  // Uses the images name to get the registry url to log into it
  const registryUrl = resolvedName.indexOf(`/`) ? resolvedName.split('/').shift() : ``

  const { dockerLogin } = await import(path.join(containerDir, 'scripts/ds/dockerLogin.js'))
  await dockerLogin(token, registryUrl)

  // Ensure the correct tag it added to the image
  const imgName = tag
    ? resolvedName.indexOf(`:`)
      ? `${resolvedName.split(`:`).shift()}:${tag}`
      : `${resolvedName}:${tag}`
    : resolvedName

  log && Logger.pair(`Running Cmd:`, `docker pull ${imgName}\n`)

  const output = await docker.pull(imgName, undefined, undefined)
  if(!log) return

  output
    ? Logger.error(`Image pull failed\n`)
    : Logger.success(`Image pull succeeded\n`)
}

export const pull = {
  name: 'pull',
  action: docPull,
  alias: [`pul`, `pl`],
  options: {
    context: {
      example: `--context proxy`,
      alias: ['ctx', `name`, `type`],
      description: `Name of the sub-repo image to pull and optionally its tag seperated by a ":"`,
    },
    tag: {
      alias: ['tg'],
      type: `string`,
      example: `--tag package`,
      allowed: [`package`, `branch`, `commit`, `values`, `env`, `node`],
      description: 'Tag name of the image to pull, overridden by context',
    },
    image: {
      alias: ['img'],
      example: `--img my-image`,
      description: 'Name of the docker image to pull, overridden by context',
    },
    registry: {
      alias: ['reg'],
      example: '--registry ghcr.io',
      description: 'Docker Registry url to log into, defaults to DOCKER_REGISTRY env',
    },
    log: {
      type: 'boolean',
      description: 'Log command before they are build',
    },
  },
}