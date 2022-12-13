import { appRoot } from '../../paths'
import { noOpArr } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
import { docker } from '../../utils/docker/docker'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { getRunImg } from '../../utils/docker/getRunImg'
import { getRunArgs } from '../../utils/docker/getRunArgs'
import { getNpmToken } from '../../utils/envs/getNpmToken'
import { addRunEnvs } from '../../utils/docker/addRunEnvs'
import { addRunPorts } from '../../utils/docker/addRunPorts'
import { getParamEnvs } from '../../utils/envs/getParamEnvs'
import { getLongContext } from '../../utils/helpers/contexts'
import { addRunVolumes } from '../../utils/docker/addRunVolumes'

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

  const imgToRun = await getRunImg(params, docFileCtx, envs)
  const runEnvs = await addRunEnvs(docFileCtx, allEnvs)

  const cmdArgs = [
    ...getRunArgs(params),
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
