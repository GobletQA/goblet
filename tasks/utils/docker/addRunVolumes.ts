import type { TTaskParams, TEnvObject } from '../../types'

import { loadEnvs } from '../envs/loadEnvs'
import { ensureArr, flatUnion } from '@keg-hub/jsutils'
import { resolveLocalPath } from '../helpers/resolveLocalPath'
import { resolveDockerPath } from '../helpers/resolveDockerPath'
import { getContextValue, getVolumeContext } from '../helpers/contexts'

/**
 * Merges the passed in param volumes with the env defined volumes 
 */
const resolveVols = (params:TTaskParams, docFileCtx:string, envs:TEnvObject) => {
  const { volumes, mount, env } = params
  const mountLoc = mount && getContextValue(docFileCtx, envs, `MOUNT_PATH`)

  return flatUnion([
    mountLoc,
    ...ensureArr(volumes),
    ...getVolumeContext(docFileCtx, env, ``).split(`,`)
  ])
}


/**
 * Converts the local part of a volume string to an absolute path when needed
 */
const checkLocalPath = (vol:string, docFileCtx:string, envs:TEnvObject) => {
  const [local, ...rest] = vol.split(`:`)

  const source = resolveLocalPath(local)
  const remote = rest?.length
    ? resolveDockerPath(rest.join(`:`), docFileCtx, envs)
    : resolveDockerPath(local, docFileCtx, envs)

  return `${source}:${remote}`
}

/**
 * Converts passed in volume params to docker api format
 */
export const addRunVolumes = (params:TTaskParams, docFileCtx:string) => {
  const { env } = params
  const envs = loadEnvs({ env })
  
  const vols = resolveVols(params, docFileCtx, envs)

  return vols.reduce((acc, vol) => {
    if(!vol) return acc

    !vol.includes(`:`)
      ? acc.push(`-v`, `${vol}:${resolveDockerPath(vol, docFileCtx, envs)}`)
      : acc.push(`-v`, checkLocalPath(vol, docFileCtx, envs))

    return acc
  }, [])
}
