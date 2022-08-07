const path = require('path')
const { scriptsDir } = require('../../paths')
const { Logger } = require('@keg-hub/cli-utils')
const { docker } = require('../../utils/docker/docker')
const { loadEnvs } = require('../../utils/envs/loadEnvs')
const { getNpmToken } = require('../../utils/envs/getNpmToken')
const { resolveImgName } = require('../../utils/docker/resolveImgName')
const { resolveContext } = require('../../utils/kubectl/resolveContext')
const { dockerLogin } = require(path.join(scriptsDir, 'js/dockerLogin'))

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
  const docFileCtx = resolveContext(context, {
    bs: 'base',
    px: `proxy`,
    sc: `screencast`,
    cd: `conductor`,
    be: 'backend',
    fe: 'frontend',
    db: 'database',
  }, ``)

  const resolvedName = resolveImgName(params, docFileCtx, allEnvs)

  // Ensure we are logged into docker
  // Uses the images name to get the registry url to log into it
  const registryUrl = resolvedName.indexOf(`/`) ? resolvedName.split('/').shift() : ``
  await dockerLogin(token, registryUrl)

  // Ensure the correct tag it added to the image
  const imgName = tag
    ? resolvedName.indexOf(`:`)
      ? `${resolvedName.split(`:`).shift()}:${tag}`
      : `${resolvedName}:${tag}`
    : resolvedName

  log && Logger.pair(`Running Cmd:`, `docker pull ${imgName}\n`)

  const output = await docker.pull(imgName)
  if(!log) return

  output
    ? Logger.error(`Image pull failed\n`)
    : Logger.success(`Image pull succeeded\n`)
}

module.exports = {
  pull: {
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
  },
}
