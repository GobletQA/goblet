import type { TTask, TTaskActionArgs } from '../../types'
import type { TDockerBuildParams } from '../../utils/docker/getDockerBuildParams'

import { appRoot } from '../../paths'
import { Logger, error } from '@keg-hub/cli-utils'
import { docker } from '../../utils/docker/docker'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { getNpmToken } from '../../utils/envs/getNpmToken'
import { setupBuildX } from '../../utils/docker/setupBuildX'
import { toBuildArgsArr } from '../../utils/docker/buildArgs'
import { getDockerFile } from '../../utils/docker/getDockerFile'
import { resolveImgTags } from '../../utils/docker/resolveImgTags'
import { resolveImgFrom } from '../../utils/docker/resolveImgFrom'
import { getDockerLabels } from '../../utils/docker/getDockerLabels'
import { getDockerBuildParams } from '../../utils/docker/getDockerBuildParams'
import { getContextValue, getLongContext } from '../../utils/helpers/contexts'
import {isStr} from '@keg-hub/jsutils'

/**
 * Runs a docker build command and returns the output
 * @function
 * @public
 * @returns {Void}
 */
const buildImg = async (args:TTaskActionArgs) => {
  const { params } = args
  const { builder, context, env, from, image, log, login } = params

  const envs = loadEnvs({ env })
  const token = getNpmToken()
  const allEnvs = { ...envs, NPM_TOKEN: token }

  // Ensure we are using the correct buildx builder instance
  builder && (await setupBuildX(isStr(builder) ? builder : `goblet`, appRoot, allEnvs))

  // Get the context for the docker image being built
  const docFileCtx = getLongContext(context)

  !docFileCtx
    && error.throwError(`Could not find Dockerfile from context "${context}"`)

  // Get the name of the image that will be built
  const imageName = image || getContextValue(docFileCtx, envs, `IMAGE`, envs.IMAGE)

  // Ensure we are logged into docker
  // Uses the DOCKER_REGISTRY env or the final images name to get the registry url to log into
  const registryUrl = envs.DOCKER_REGISTRY || imageName.split('/').shift()
  login && await docker.login(token, registryUrl)

  // Set the custom base image based on the from option and context
  allEnvs.IMAGE_FROM = resolveImgFrom(docFileCtx, allEnvs, from, imageName)

  const builtTags = await resolveImgTags(params, docFileCtx, envs)

  const buildParams = getDockerBuildParams(params as TDockerBuildParams)
  const labels = getDockerLabels(docFileCtx, env)
  const dockerFile = getDockerFile(docFileCtx)
  const buildArgsArr = toBuildArgsArr(allEnvs)

  const cmdArgs = [
    ...buildParams,
    ...builtTags,
    ...labels,
    ...dockerFile,
    ...buildArgsArr,
    `.`,
  ].filter((arg) => arg)

  log && Logger.pair(`Running Cmd:`, `docker ${cmdArgs.join(' ')}\n`)

  const output = await docker.build(cmdArgs, { cwd: appRoot, env: allEnvs }, params)
  if (!log) return

  output
    ? Logger.error(`Image build failed\n`)
    : Logger.success(`Image build succeeded\n`)

  return output
}

export const build:TTask = {
  name: `build`,
  alias: [`bld`],
  action: buildImg,
  example: `pnpm task dev img build <options>`,
  description: `Calls the image build command`,
  options: {
    context: {
      example: `--context proxy`,
      alias: [`ctx`, `name`, `type`],
      description: `Context or name to use when resolving the Dockerfile to built`,
    },
    push: {
      type: `boolean`,
      default: false,
      description: `Push the built image to the docker provider`,
    },
    tag: {
      type: `array`,
      alias: [`tags`],
      default: [`package`, `values`],
      example: `--tag package,branch`,
      allowed: [`package`, `branch`, `commit`, `values`, `env`, `node`],
      description: `Name of the tag to add to the built Docker image`,
    },
    image: {
      env: `GB_BUILD_IMAGE`,
      description: `Name of the docker image to be built. Used when tagging`,
    },
    force: {
      default: true,
      type: `boolean`,
      description: `Force remove temporary images used while building`,
    },
    log: {
      type: `boolean`,
      description: `Log command before they are build`,
    },
    builder: {
      default: `goblet`,
      description: `Name of the docker buildx builder instance to use`,
    },
    cache: {
      type: `boolean`,
      default: true,
      description: `User docker cache when building the image`,
    },
    platforms: {
      type: `array`,
      default: [`linux/amd64`, `linux/arm64`],
      description: `List of docker platforms to be built`,
    },
    tagMatch: {
      type: `string`,
      example: `--tagMatch main:branch`,
      description: `Use a specific tag type based on the git branch`,
    },
    base: {
      type: `boolean`,
      example: `--base`,
      description: `Should the base image be built first. Only used when "--context" option is set`,
    },
    from: {
      example: `--from 2.4.3`,
      description: `Base docker image version or tag to use when build non base image. Only used when "--context" option is set`,
    },
    login: {
      default: true,
      type: `boolean`,
      alias: [`auth`],
      example: `--no-login`,
      description: `Log into the docker registry before building the image. Typically used along side the push option`,
    }
  },
}
