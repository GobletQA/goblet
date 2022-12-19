import type { TTaskParams } from '../../types'

import { loadEnvs } from '../envs/loadEnvs'
import { ensureArr, flatUnion } from '@keg-hub/jsutils'
import { resolveLocalPath } from '../helpers/resolveLocalPath'
import { getContextValue, getVolumeContext } from '../helpers/contexts'

/**
 * Merges the passed in param volumes with the env defined volumes 
 */
const resolveVols = (params:TTaskParams, docFileCtx:string) => {
  const { volumes, mount, env } = params
  const envs = loadEnvs({ env })
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
const checkLocalPath = (vol:string) => {
  const [local, ...rest] = vol.split(`:`)

  const source = resolveLocalPath(local)

  return `${source}:${rest.join(`:`)}`
}

/**
 * Converts passed in volume params to docker api format
 */
export const addRunVolumes = (params:TTaskParams, docFileCtx:string) => {
  const vols = resolveVols(params, docFileCtx)

  return vols.reduce((acc, vol) => {
    if(!vol) return acc
    
    !vol.includes(`:`)
      ? acc.push(`-v`, `${vol}:${vol}`)
      : acc.push(`-v`, checkLocalPath(vol))

    return acc
  }, [])
}
