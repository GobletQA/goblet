import type { TTaskParams } from '../../types'

import { appRoot } from '../../paths'
import { loadEnvs } from '../envs/loadEnvs'
import { addPlatforms } from './addPlatforms'
import { loadScript } from '../helpers/loadScript'
import { DockerBuildxBuilder } from '../../constants/constants'
import { docker as dockerCmd, Logger } from '@keg-hub/cli-utils'
import {
  isStr,
  isObj,
  isArr,
  emptyObj,
  emptyArr,
  deepMerge,
} from '@keg-hub/jsutils'

export type TBuildArgs = [string[], Record<string, any>, TTaskParams]
export type TDockerCmdAdd = [args:string[], params?:Record<any, any>, opts?:Record<any, any>]
export type TDockerResolveArr = [string, string[], Record<any, any>, Record<any, any>]
export type TBuildXCB = (cmd:string, opts?:string[], options?:Record<string, any>) => void
export type TDockerMethod = (
  cmd:string,
  argsArr:string[],
  dynArgs:Record<any, any>,
  opts?:Record<string, any>
) => void


/**
 * Sets up docker to use buildX build instead of build
 * Also check and add platforms, if the build is being pushed
 */
const buildX = (
  cmd:string,
  callback:TBuildXCB,
  cmdArgs:string[]=emptyArr as string[],
  options:Record<string, any>=emptyObj,
  params:TTaskParams=emptyObj as TTaskParams
) => {
  const { push, builder=DockerBuildxBuilder } = params

  // Add the build platform for the image
  const platformOpts = !push
    ? [ cmd, `--load`]
    : [
        cmd,
        `--builder`,
        builder,
        `--push`,
        ...addPlatforms(
          [ ...(params?.platforms || emptyArr), ...(options?.platforms || emptyArr) ],
          push
        )
      ]

  const allArgs = platformOpts.concat(toArr(cmdArgs))
  params.log && Logger.pair(
    `Running Cmd:`,
    `docker buildx ${allArgs.join(' ')}\n`
  )

  // Call the callback, adding the platform args array with the first arg, which should be an array
  // Then spread the other args to match calling the docker command
  return callback(`buildx`, allArgs, options)
}

/**
 * Checks the passed in arguments and reorders them based on their type
 * If no opts and dynArgs is an Object
 * Then treat argsArr as an empty array
 * then update dynArgs and opts
 */
const resolveArgs = (
  method:TDockerMethod,
  cmd:string,
  argsArr:string[] = emptyArr,
  dynArgs?:Record<any, any>,
  opts?:Record<any, any>
) => {
  // If no opts are passed, and dynArgs is an object
  // The update the args to match the other call signature
  if (!opts && isObj(dynArgs)) {
    opts = dynArgs
    dynArgs = argsArr
    argsArr = emptyArr
  }

  return method(cmd, argsArr, dynArgs, opts || emptyObj)
}

/**
 * Converts the passed in args to an array if it's a string
 */
const toArr = (args:string|string[]) => {
  return [...(isStr(args) ? args.split(' ') : args)]
}

/**
 * Runs a docker command based on the passed in arguments
 * @param {string} cmd - Docker command to run
 * @param {Array<string>|string} args - arguments of the command
 * @param {Object} opts - Options to pass to the spawned child process
 *
 * @returns {*} - Response from the spawned child process
 */
const dockerExec = async (
  cmd:string,
  preArgs?:string[],
  postArgs?:string[],
  opts:Record<any, any>=emptyObj
) => {
  const {
    env,
    log,
    envFile,
    envFiles = emptyArr,
    cwd = appRoot,
    envs = emptyObj,
    ...cmdOpts
  } = opts

  const cmdEnvs = {
    ...(envFile || envFiles ? loadEnvs({ env, locations: [...envFiles, envFile] }) : emptyObj),
    ...envs,
  }

  const options = deepMerge({ env: cmdEnvs, log }, cmdOpts)
  const cmdArgs = [...toArr(preArgs), cmd, ...toArr(postArgs)].filter(arg => arg)

  log && Logger.log(cmdArgs.join(' '))

  return await dockerCmd(cmdArgs, options, cwd)
}

const login = async (...args) => {
  const { dockerLogin } = await loadScript(`dockerLogin`)
  
  return !isArr(args[0]) && (!args[1] || isStr(args[1]))
    ? await dockerLogin(...args)
    : await dockerCmd([`login`, ...args[0]], args[1], args[2])
}

const createContext = async (args, options=emptyObj, cwd=appRoot) => {
  return await dockerCmd([`context`, `create`, ...args], options, cwd)
}

const useContext = async (args, options=emptyObj, cwd=appRoot) => {
  return await dockerCmd([`context`, `use`, ...args], options, cwd)
}

export const docker = (
  cmd:string,
  argsArr:string[] = emptyArr,
  dynArgs?:Record<any, any>,
  opts?:Record<any, any>
) => resolveArgs(dockerExec, cmd,  argsArr, dynArgs, opts)

docker.run = (...args:TDockerCmdAdd) => docker('run', ...args)
docker.stop = (...args:TDockerCmdAdd) => docker('stop', ...args)
docker.remove = (...args:TDockerCmdAdd) => docker('rm', ...args)
docker.exec = (...args:TDockerCmdAdd) => docker('exec', ...args)
docker.build = (...args):any => buildX(
  `build`,
  ((...args) => docker(...args)) as TBuildXCB,
  ...args as TBuildArgs
)
docker.pull = (...args:TDockerCmdAdd) => dockerCmd([
  `pull`,
  ...toArr(args.shift() as string[])],
  ...args as Record<any, any>[]
)

docker.attach = docker.exec
docker.login = login
docker.context = {
  use: useContext,
  create: createContext,
}

