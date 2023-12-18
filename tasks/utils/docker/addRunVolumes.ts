import type { TTaskParams, TEnvObject } from '../../types'

import path from 'node:path'
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

  return { full: `${source}:${remote}`, remote, source }
}


const buildVolumesArr = (params:TTaskParams, vol:string, docFileCtx:string, envs:TEnvObject) => {
  const { vnm } = params
  const args = [`-v`]
  let remote:string

  if(!vol.includes(`:`)){
    remote = resolveDockerPath(vol, docFileCtx, envs)
    args.push(`${vol}:${remote}`)
    
  }
  else {
    const { full, ...rest } = checkLocalPath(vol, docFileCtx, envs)
    remote = rest.remote
    args.push(full)
  }

  if(!vnm) args.push(`-v`, path.join(remote, `/node_modules`))

  return args
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

    acc.push(...buildVolumesArr(params, vol, docFileCtx, envs))

    return acc
  }, [])
}
