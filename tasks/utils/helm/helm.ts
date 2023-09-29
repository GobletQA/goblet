import type { TTaskParams } from '../../types'

import { command } from '../process/command'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getDevspaceContext } from '../devspace/getDevspaceContext'

type TCallback = (args:string|string[], params?:Record<any, any>) => Promise<any>
type TRepoObj = {
  add: TCallback
  update: TCallback
}

/**
 * Runs a kubectl command and returns the output
 * Exits the process if the devspace command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - kubectl command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const helmCmd = command(`helm`)

export const helm = async (
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => {

  const cmdArgs = [...args]
  const contextArgs = await getDevspaceContext(params)

  !params.skipNs && cmdArgs.push(`--namespace`, contextArgs.namespace)
  !params.skipContext && cmdArgs.push(`--kube-context`, contextArgs.context)

  // console.log(`helm ${cmdArgs.join(' ')}`)

  return await helmCmd(cmdArgs, params)
}

const helmAction = async (
  method:string,
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => {
  return await helm([
    method,
    ...args
  ], { exec: true, ...params })
}

helm.upgrade = async (
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => helmAction(`upgrade`, args, params)

helm.install = async (
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => helmAction(`install`, args, params)

helm.uninstall = async (
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => helmAction(`uninstall`, args, params)

helm.delete = async (
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => helmAction(`delete`, args, params)

helm.repo = {} as TRepoObj

const repoAction = async (
  method:string,
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => {
  return await helm([
    `repo`,
    method,
    ...args
  ], params)
}

helm.repo.add = async (
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => repoAction(`add`, args, params)

helm.repo.update = async (
  args:string[] = emptyArr,
  params:TTaskParams = emptyObj as TTaskParams
) => repoAction(`update`, args, params)
