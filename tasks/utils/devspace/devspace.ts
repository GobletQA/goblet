import type { TTaskParams } from '../../types'

import { Logger } from '@keg-hub/cli-utils'
import { command } from '../process/command'
import { kubectl } from '../kubectl/kubectl'
import { getCmdOptions } from './getCmdOptions'
import { getConfigPath } from './getConfigPath'
import { getDeployments } from './getDeployments'
import { getLabelSelector } from './getLabelSelector'
import { getDevspaceContext } from './getDevspaceContext'
import { get, ensureArr, noOpObj } from '@keg-hub/jsutils'

const emptyParams = noOpObj as TTaskParams

/**
 * Finds the index of the last argument with a --, and appends the default devspace arguments
 */
const addDefaultArgs = async (
  cmd:string|string[],
  params:TTaskParams=emptyParams
) => {
  const contextArgs = await getDevspaceContext(params)

  /**
   * Ensure the cmd is an array, and find the last argument with a `-`
   * Then use that index as the location to add the default arguments
   */
  let insertIdx
  const cmdArr = ensureArr(cmd).map((item, idx) => {
    insertIdx = item.startsWith(`-`) ? idx : insertIdx
    return item
  })

  insertIdx = insertIdx || cmdArr.length
  const dsConfig = getConfigPath(params)
  const defArgs = [`--config`, dsConfig]
  Logger.pair(`Using Devspace config`, dsConfig)

  const profile = params.profile || params.env
  profile && defArgs.push(`--profile`, profile)

  /** Add the default arguments at the found insertIdx */
  cmdArr.splice(insertIdx, 0, ...contextArgs, ...defArgs)

  return cmdArr as string[]
}

/**
 * Runs a devspace command and returns the output
 * Exits the process if the devspace command throws an error
 *
 * @returns {Void}
 */
export const devspaceCmd = command('devspace')

export const devspace = async (
  cmd:string|string[],
  params:TTaskParams=emptyParams
) => {
  const cmdArgs = await addDefaultArgs(cmd, params)

  return await devspaceCmd(cmdArgs, params)
}

devspace.deploy = async (params:TTaskParams=emptyParams) => {
  const { skip, force, ...cmdParams } = params
  const cmdArgs:string[] = []

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(cmdParams.context, skip, params.env)
  deployments && cmdArgs.push(`--deployments`, deployments)
  force && cmdArgs.push(`--force-deploy`)

  await devspace([`deploy`, ...cmdArgs], cmdParams)
}

devspace.enter = async (params:TTaskParams=emptyParams) => {
  const cmdArgs = [`enter`]
  const { selector, args } = getLabelSelector(params)

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}


devspace.cleanImgs = async (params:TTaskParams=emptyParams) => (await devspace([`cleanup`, `images`], params))


devspace.logs = async (params:TTaskParams=emptyParams) => {
  const { follow } = params

  const cmdArgs = [`logs`]
  follow && cmdArgs.push(`--follow`)

  const { selector, args } = getLabelSelector(params)
  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}


devspace.purge = async (params:TTaskParams=emptyParams) => {
  const { skip, ...cmdParams } = params

  const cmdArgs:string[] = []
  params.dependencies && cmdArgs.push(`--all`)

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(cmdParams.context, skip, params.env)
  deployments && cmdArgs.push(`--deployments`, deployments)

  return await devspace([`purge`, ...cmdArgs], cmdParams)
}

/**
 * Runs the devspace run command, passing in the command name as an argument
 */
devspace.run = async (params:TTaskParams=emptyParams) => (await devspace([`run`, params.cmd], params))

/**
 * Checks if devspace is already running, by checking in the pod already exists and is in a Running phase
 */
devspace.running = async (params:TTaskParams=emptyParams) => {
  const { namespace, context } = getDevspaceContext(params)
  await devspace.use({ ...params, namespace, context })

  const pod = await kubectl.getPod({ ...params, context: 'app' })

  return get(pod, `status.phase`) === `Running` ? pod : false
}


devspace.start = async (
  params:TTaskParams=emptyParams,
  daemonOpts:Omit<TTaskParams, 'env'>=emptyParams,
) => {
  const cmdArgs = getCmdOptions(params, {
    build: '-b',
    debug: `--debug`,
  }, ['deployments'])

  /**
   * Check if devspace is already running
   * If it is, and build is not set, then skip the deploy process
   * And only setup the port-forwarding and file syncing
   */
  const isRunning = await devspace.running(params)
  isRunning && !params.build && cmdArgs.push(`--skip-pipeline`)

  // Add the daemon back the the params for the devspace dev command
  return await devspace([`dev`, ...cmdArgs], { ...params, ...daemonOpts })
}

devspace.sync = async (params:TTaskParams=emptyParams) => {
  const { selector, args } = getLabelSelector(params)

  const { local, container } = params
  const cmdArgs = [`sync`, `--local-path=${local}`, `--container-path=${container}`]

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}

devspace.use = async (params:TTaskParams=emptyParams) => {
  const { namespace, context } = params
  context && await devspace([`use`, `context`, context], params)
  namespace && await devspace([`use`, `namespace`, namespace], params)
}

