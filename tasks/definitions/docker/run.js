const { appRoot } = require('../../paths')
const { noOpArr } = require('@keg-hub/jsutils')
const { docker } = require('../../utils/docker/docker')
const { error, Logger } = require('@keg-hub/cli-utils')
const { loadEnvs } = require('../../utils/envs/loadEnvs')
const { getNpmToken } = require('../../utils/envs/getNpmToken')
const { addRunEnvs } = require('../../utils/docker/addRunEnvs')
const { addRunPorts } = require('../../utils/docker/addRunPorts')
const { addRunVolumes } = require('../../utils/docker/addRunVolumes')
const { getTagOptions } = require('../../utils/docker/getTagOptions')
const { resolveImgName } = require('../../utils/docker/resolveImgName')
const { resolveContext } = require('../../utils/kubectl/resolveContext')

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
const getDockerRunArgs = ({ remove, attach, name, pull }) => {
  const args = []
  remove && args.push(`--rm`)
  attach && args.push(`-it`)
  name && args.push(`--name`, name)

  [(`missing`, `never`, `always`)].includes(pull)
    ? args.push(`--pull=${pull}`)
    : args.push(`--pull=never`)

  return args
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
  const { params, options } = args
  const { context, env, log } = params

  const envs = loadEnvs({ env })
  const token = getNpmToken()
  const allEnvs = { ...envs, NPM_TOKEN: token }

  // Get the context for the docker image being run
  const docFileCtx = resolveContext(
    context,
    {
      app: `app`,
      px: `proxy`,
      db: 'database',
      sc: `screencast`,
      cd: `conductor`,
      be: 'backend',
      fe: 'frontend',
    },
    'app'
  )

  const imgToRun = await getImgToRun(params, docFileCtx, envs)

  const cmdArgs = [
    ...getDockerRunArgs(params),
    ...addRunEnvs(allEnvs, docFileCtx),
    ...addRunPorts(params, allEnvs, docFileCtx),
    ...addRunVolumes(params, allEnvs, docFileCtx),
    imgToRun,
    ...getRunCmd(params, options),
  ].filter((arg) => arg)

  log && Logger.pair(`Running Cmd:`, `docker ${cmdArgs.join(' ')}\n`)

  const output = await docker.run(cmdArgs, { cwd: appRoot, env: allEnvs })
  log && Logger.log(output)

  return output
}

module.exports = {
  run: {
    name: 'run',
    action: runImg,
    alias: ['rn', 'rnu'],
    options: {
      context: {
        example: `--context proxy`,
        alias: ['ctx', `name`, `type`],
        description: `Context or name to use when resolving the Dockerfile to built`,
      },
      cmd: {
        alias: ['command', 'cdm', 'cd'],
        example: '--cmd "ls -ls /goblet/app"',
        description: `Override the default command of the docker image`,
      },
      ports: {
        default: [],
        type: 'array',
        alias: ['pt', 'port'],
        description: 'Bind a local port to the docker containers port',
      },
      attach: {
        default: true,
        type: 'boolean',
        alias: ['it', 'att'],
        description:
          'Attach to the stdio of the running container, same as -it option of the docker cli',
      },
      remove: {
        default: true,
        alias: ['rm'],
        type: 'boolean',
        description:
          'Automatically remove the container once it is stopped, same as --rm option of the docker cli',
      },
      pull: {
        alias: ['pl'],
        example: `--pull`,
        default: `never`,
        description: 'Image pull policy passed to the docker cli',
      },
      name: {
        alias: ['nm'],
        example: `--name my-container`,
        description: 'Name of the container being run',
      },
      volumes: {
        type: 'array',
        alias: ['vol', 'vols'],
        example: `--volumes /local/1/path:/remote/1/path,/local/2/path:/remote/2/path`,
        description: 'Volumes to mount to the running container separated by a comma',
      },
      image: {
        alias: ['img', 'igm', 'im'],
        example: `--image backend`,
        description:
          'Name of the image to be run, can also include the tag separated by a :',
      },
      tag: {
        alias: ['tg', 'tga'],
        default: `values`,
        example: `--tag package`,
        description:
          'Name of the tag of the image to be run if separate from the defined image',
      },
      log: {
        type: 'boolean',
        description: 'Log command before they are build',
      },
    },
  },
}
