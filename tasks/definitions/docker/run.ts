import { appRoot } from '../../paths'
import { docker } from '../../utils/docker/docker'
import { error, Logger } from '@keg-hub/cli-utils'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { getNpmToken } from '../../utils/envs/getNpmToken'
import { addRunEnvs } from '../../utils/docker/addRunEnvs'
import { addRunPorts } from '../../utils/docker/addRunPorts'
import { getLongContext } from '../../utils/helpers/contexts'
import { noOpArr, noOpObj, ensureArr } from '@keg-hub/jsutils'
import { addRunVolumes } from '../../utils/docker/addRunVolumes'
import { getTagOptions } from '../../utils/docker/getTagOptions'
import { resolveImgName } from '../../utils/docker/resolveImgName'

/**
 * TODO: @lance-tipton We could try to parse the cmd form the options array
 * It will take a bit more time to investigate how to do that properly
 * So for now just use the `cmd` option
 */
const getRunCmd = (params) => {
  const { cmd } = params
  return (cmd && cmd.split(' ')) || noOpArr
}

/**
 * Finds the correct image to run based on passed in params
 * @param {Object} params - Parsed options passed to the run task
 * @param {string} docFileCtx - Current context of the docker image to run
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 *
 * @returns {string} - Image to use when running the container
 */
const getImgToRun = async (params, docFileCtx, envs) => {
  let tag = params?.image?.includes(':')
    ? params?.image?.split(':').pop()
    : (await getTagOptions(params, docFileCtx, envs))?.[params?.tag] || params?.tag

  const image = resolveImgName(params, docFileCtx, envs)

  return image
    ? `${image}:${tag}`
    : error.throwError(`Count not resolve image to run`, params, docFileCtx, envs)
}

/**
 * Gets the arguments to pass to the docker cli run command
 * @param {Object} params - Parsed options passed to the run task
 *
 * @returns {Array} - Generated docker cli run command arguments
 */
const getDockerRunArgs = ({ remove, attach, name, pull, privileged }) => {
  const args = []
  remove && args.push(`--rm`)
  attach && args.push(`-it`)
  name && args.push(`--name`, name)
  privileged && args.push(`--privileged`)

  ;([`missing`, `never`, `always`]).includes(pull)
    ? args.push(`--pull=${pull}`)
    : args.push(`--pull=never`)

  return args
}


const getParamEnvs = ({ envs }) => {
  return !envs
    ? noOpObj
    : (ensureArr(envs) as string[]).reduce((acc:Record<string, string>, item:string) => {
        if(!item.includes(`:`))
          error.throwError(`Missing key/value separator ":" for env: ${item}`)

        const [key, val] = item.split(`:`)
        acc[key] = val

        return acc
      }, {})
}

/**
 * Runs a local docker image as a container
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
const runImg = async (args) => {
  const { params } = args
  const { context, env, log } = params

  const envs = loadEnvs({ env })
  const token = getNpmToken()
  const allEnvs = { ...envs, NPM_TOKEN: token, ...getParamEnvs(params) }

  // Get the context for the docker image being run
  const docFileCtx = getLongContext(context, 'app')

  const imgToRun = await getImgToRun(params, docFileCtx, envs)
  const runEnvs = await addRunEnvs(docFileCtx, allEnvs)

  const cmdArgs = [
    ...getDockerRunArgs(params),
    ...runEnvs,
    ...addRunPorts(params, allEnvs, docFileCtx),
    ...addRunVolumes(params, docFileCtx),
    imgToRun,
    ...getRunCmd(params),
  ].filter((arg) => arg)

  log && Logger.pair(`Running Cmd:`, `docker ${cmdArgs.join(' ')}\n`)

  const output = await docker.run(cmdArgs, { cwd: appRoot, env: allEnvs })
  log && Logger.log(output)

  return output
}

export const run = {
  name: 'run',
  action: runImg,
  alias: [`rn`, `rnu`],
  options: {
    context: {
      example: `--context proxy`,
      alias: [`ctx`, `name`, `type`],
      description: `Context or name to use when resolving the Dockerfile to built`,
    },
    cmd: {
      alias: [`command`, `cdm`, `cd`],
      example: `--cmd "ls -ls /goblet/app"`,
      description: `Override the default command of the docker image`,
    },
    ports: {
      default: [],
      type: `array`,
      alias: [`pt`, `port`],
      description: `Bind a local port to the docker containers port`,
    },
    attach: {
      default: true,
      type: `boolean`,
      alias: [`it`, `att`],
      description:
        `Attach to the stdio of the running container, same as -it option of the docker cli`,
    },
    remove: {
      default: true,
      alias: [`rm`],
      type: `boolean`,
      description:
        `Automatically remove the container once it is stopped, same as --rm option of the docker cli`,
    },
    pull: {
      alias: [`pl`],
      example: `--pull`,
      default: `never`,
      description: `Image pull policy passed to the docker cli`,
    },
    name: {
      alias: [`nm`],
      example: `--name my-container`,
      description: `Name of the container being run`,
    },
    volumes: {
      type: `array`,
      alias: [`vol`, `vols`],
      example: `--volumes /local/1/path:/remote/1/path,/local/2/path:/remote/2/path`,
      description: `Volumes to mount to the running container separated by a comma`,
    },
    mount: {
      alias: [`mt`],
      type: `boolean`,
      example: `--mount `,
      description: `Auto mounts the root directory into the container`,
    },
    image: {
      alias: [`img`, `igm`, `im`],
      example: `--image backend`,
      description: `Name of the image to be run, can also include the tag separated by a :`,
    },
    tag: {
      alias: [`tg`, `tga`],
      default: `values`,
      example: `--tag package`,
      description: `Name of the tag of the image to be run if separate from the defined image`,
    },
    privileged: {
      type: `boolean`,
      alias: [`priv`, `prv`],
      example: `--privileged`,
      description: `Run the docker images with the --privileged option`,
    },
    envs: {
      type: `array`,
      example: `--envs key1:value1,key2:value2`,
      description: `Custom envs to pass to the image. Override the default from values file`,
    },
    log: {
      type: `boolean`,
      description: `Log command before they are build`,
    },
  },
}
