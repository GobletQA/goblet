import type { TGobletCfgLoaderResp, TGitData, TGobletConfig } from '../types'

import path from 'node:path'
import { promises as fs } from 'node:fs'
import { ENVS } from '@gobletqa/environment'
import { buildRefFromRemote } from './getRepoRef'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { addConfigFileTypes } from './addConfigFileTypes'
import defConfig from '@gobletqa/configs/goblet.default.config'
import { GobletConfigFileNames, GobletConfigRef } from '@gobletqa/environment/constants'

export type TGobletRefOpts = {
  ref?:string
  remote?:string
  repoRoot:string
  location:string
}

const pathExists = async (loc:string):Promise<[Error, boolean]> => {
  try {
    await fs.access(loc, fs.constants.F_OK)
    return [undefined, true]
  }
  catch(err) {
    return [err, undefined]
  }
}

const findGobletCfgLoc = async (base:string) => {
  return GobletConfigFileNames.reduce(async (found, name) => {
    const loc = await found
    if(loc) return loc

    const location = path.join(base, name)
    const [err, exists] = await pathExists(location)

    return exists ? location : found
  }, Promise.resolve(``))
} 

const getRef = (opts:TGobletRefOpts) => {
  const ref = opts.ref || ENVS.GB_REPO_CONFIG_REF || ``
  const remote = opts.remote || ENVS.GB_GIT_REPO_REMOTE

  if(ref) return { $ref: ref }
  if(!remote) throw new Error(`Missing required $ref for repository`)

  return { $ref: buildRefFromRemote(remote) }

}


/**
 * Ensures the $ref is added to the gobletConfig
 */
const addRefToConfig = (config: TGobletConfig, opts:TGobletRefOpts) => {
  return {...config, ...getRef(opts)} as TGobletConfig
}

/**
 * Check for the $ref in the goblet config
 * Finds all refs to the GobletConfigRef constant, and replaces it with the real $ref
 */
export const replaceGobletConfigRef = async (gitData:TGitData, cfgLoc?:string) => {
  cfgLoc = cfgLoc || await findGobletCfgLoc(gitData.local)
  const content = await fs.readFile(cfgLoc, `utf8`)

  const replaced = content.replaceAll(GobletConfigRef, buildRefFromRemote(gitData.remote))
  await fs.writeFile(cfgLoc, replaced, `utf8`)

  return true
}

export const ensureGobletCfg = (cfg: TGobletConfig, opts:TGobletRefOpts):TGobletCfgLoaderResp => {
  const config = addConfigFileTypes(deepMerge<TGobletConfig>(defConfig, cfg))

  const { repoRoot, location } = opts

  // Ensure the repoRoot path gets set
  // This should never happen because it's enforce when the repo is mounted
  // But its a hold over from the past
  // So keeping it for now until I can validate it's not needed
  !config?.paths?.repoRoot
    && (config.paths = {...config?.paths, repoRoot })

  return config?.$ref && config?.$ref !== GobletConfigRef
    ? { config, location }
    : { config: addRefToConfig(config, opts), refReplaced: true, location }
}
