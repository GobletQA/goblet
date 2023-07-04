import type { TTaskParams, TEnvObject } from '../../types'
import { getContextValue } from '../../utils/helpers/contexts'
import { ensureArr, toBool, isStr, isNum, toStr, noPropArr, exists } from '@keg-hub/jsutils'

/**
 * Finds the ports to bind from the localhost to a docker container
 */
const resolveAllPorts = (params:TTaskParams, envs:TEnvObject, docFileCtx:string) => {
  const { ports, fallback } = params
  const paramPorts = ensureArr(ports || [])

  const valuesFB = exists(fallback) && !fallback
    ? []
    : [
        envs.GB_BE_PORT,
        envs.GB_FE_PORT,
        envs.GB_SC_PORT,
        envs.GB_DB_PORT,
        envs.GB_PX_PORT,
      ]

  // Get the ports for the docker image being run
  // TODO: @lance-tipton make this so it's not hard coded to ENVs
  const envPorts = getContextValue(docFileCtx, envs, `PORT`, valuesFB)

  return paramPorts.concat(envPorts)
}

/**
 * Checks if binding a local port to the container should be skipped
 */
const skipPortBind = (ports:string[]|number[]=noPropArr) => {
  return ports.map(toBool).includes(false)
}

/**
 * Gets the local ports that should be bound to the running container
 */
export const addRunPorts = (params:TTaskParams, envs:TEnvObject, docFileCtx:string) => {
  if(skipPortBind(params.ports)) return noPropArr

  return resolveAllPorts(params, envs, docFileCtx)
    .map(p =>  p && toStr(p))
    .reduce((acc, port) => {
      if(!port || (!isStr(port) && !isNum(port))) return acc

      port.includes(`:`) || port.includes(`/`)
        ? acc.push(`-p`, port)
        : acc.push(`-p`, `${port}:${port}`)

      return acc
    }, [])
}
