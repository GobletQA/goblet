const path = require('path')
const { appRoot, scriptsDir } = require('../../paths')
const { docker, Logger } = require('@keg-hub/cli-utils')
const { loadEnvs } = require('../../utils/envs/loadEnvs')
const { getNpmToken } = require('../../utils/envs/getNpmToken')
const { setupBuildX } = require('../../utils/docker/setupBuildX')
const { toBuildArgsArr } = require('../../utils/docker/buildArgs')
const { addPlatforms } = require('../../utils/docker/addPlatforms')
const { getDockerFile } = require('../../utils/docker/getDockerFile')
const { resolveImgTags } = require('../../utils/docker/resolveImgTags')
const { resolveContext } = require('../../utils/kubectl/resolveContext')
const { getDockerLabels } = require('../../utils/docker/getDockerLabels')
const { getContextValue } = require('../../utils/helpers/getContextValue')
const { getDockerBuildParams } = require('../../utils/docker/getDockerBuildParams')

const { dockerLogin } = require(path.join(scriptsDir, 'js/dockerLogin'))

/**
 * Looks for a custom IMAGE_FROM value based on the context or custom context env
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} allEnvs - All loaded envs for the app
 * @param {string} from - Value passed to the from option from the cmd line
 *
 * @returns {void}
 */
const resolveImgFrom = (docFileCtx, allEnvs, from, imageName) => {
  // If from option is set, then set the IMAGE_FROM value
  // Which will override the default IMAGE_FROM in the Dockerfile
  // If it includes a : assume a image and tag, otherwise assume from is a tag
  return from
    ? from.includes(':')
        ? from
        : `${imageName}:${from}`
    : getContextValue(docFileCtx, allEnvs, `IMAGE_FROM`, allEnvs.GB_IMAGE_FROM)
}

/**
 * Runs a docker build command and returns the output
 * @function
 * @public
 * @param {string|Array<string>} cmd - kubectl command to build split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const buildImg = async (args) => {
  const { params } = args
  const { builder, context, env, from, image, log, platforms, push } = params

  const envs = loadEnvs({ env })
  const token = getNpmToken()
  const allEnvs = { ...envs, NPM_TOKEN: token }

  // Ensure we are using the correct buildx builder instance
  builder && (await setupBuildX(builder, appRoot, allEnvs))

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

  // Get the name of the image that will be built
  const imageName = image || getContextValue(docFileCtx, envs, `IMAGE`, envs.IMAGE)

  // Ensure we are logged into docker
  // Uses the DOCKER_REGISTRY env or the final images name to get the registry url to log into
  const registryUrl = envs.DOCKER_REGISTRY || imageName.split('/').shift()
  await dockerLogin(token, registryUrl)

  // Set the custom base image based on the from option and context
  allEnvs.IMAGE_FROM = resolveImgFrom(docFileCtx, allEnvs, from, imageName)

  const builtTags = await resolveImgTags(params, docFileCtx, envs)

  const cmdArgs = [
    `buildx`,
    `build`,
    ...getDockerBuildParams(params),
    ...builtTags,
    ...getDockerLabels(docFileCtx, envs),
    ...getDockerFile(docFileCtx),
    ...addPlatforms(platforms, push),
    ...toBuildArgsArr(allEnvs),
    `.`,
  ].filter((arg) => arg)

  log && Logger.pair(`Running Cmd:`, `docker ${cmdArgs.join(' ')}\n`)

  const output = await docker(cmdArgs, { cwd: appRoot, env: allEnvs })
  if (!log) return

  output
    ? Logger.error(`Image build failed\n`)
    : Logger.success(`Image build succeeded\n`)

  return output
}

module.exports = {
  build: {
    name: 'build',
    alias: ['bld'],
    action: buildImg,
    example: 'yarn task dev img build <options>',
    description: 'Calls the image build command',
    options: {
      context: {
        example: `--context proxy`,
        alias: ['ctx', `name`, `type`],
        description: `Context or name to use when resolving the Dockerfile to built`,
      },
      push: {
        type: 'boolean',
        default: false,
        description: 'Push the built image to the docker provider',
      },
      tag: {
        type: `array`,
        alias: ['tags'],
        default: [`package`, `values`],
        example: `--tag package,branch`,
        allowed: [`package`, `branch`, `commit`, `values`, `env`, `node`],
        description: 'Name of the tag to add to the built Docker image',
      },
      image: {
        env: `GB_BUILD_IMAGE`,
        description: 'Name of the docker image to be built. Used when tagging',
      },
      force: {
        default: true,
        type: 'boolean',
        description: 'Force remove temporary images used while building',
      },
      log: {
        type: 'boolean',
        description: 'Log command before they are build',
      },
      builder: {
        default: `goblet`,
        description: 'Name of the docker buildx builder instance to use',
      },
      cache: {
        type: 'boolean',
        default: true,
        description: 'User docker cache when building the image',
      },
      platforms: {
        type: `array`,
        default: [`linux/amd64`, `linux/arm64`],
        description: 'List of docker platforms to be built',
      },
      tagMatch: {
        type: `string`,
        example: `--tagMatch main:branch`,
        description: `Use a specific tag type based on the git branch`,
      },
      base: {
        type: 'boolean',
        example: `--base`,
        description: `Should the base image be built first. Only used when "--context" option is set`,
      },
      from: {
        example: `--from 2.4.3`,
        description: `Base docker image version or tag to use when build non base image. Only used when "--context" option is set`,
      },
    },
  },
}
