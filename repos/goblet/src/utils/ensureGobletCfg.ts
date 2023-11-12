import type { TGobletCfgLoaderResp, TGitData, TGobletConfig } from '../types'

import path from 'node:path'
import { promises as fs } from 'node:fs'
import { ENVS } from '@gobletqa/environment'
import { buildRefFromRemote } from './getRepoRef'
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


/**
 * This ensure the $ref is set in the repos Goblet Config
 * Might be a good idea to add a check afterwards to ensure it was properly replaced
 * But that would require loading the config from disk, which would slow the process down a lot
 * Leaving out for now, but may need to add later
 */
export const replaceGobletConfigRef = async (gitData:TGitData, cfgLoc?:string) => {
  cfgLoc = cfgLoc || await findGobletCfgLoc(gitData.local)
  const content = await fs.readFile(cfgLoc, `utf8`)

  const replaced = content.replaceAll(GobletConfigRef, buildRefFromRemote(gitData.remote))
  await fs.writeFile(cfgLoc, replaced, `utf8`)

  return true
}

const getRef = (opts:TGobletRefOpts) => {
  const ref = opts.ref || ENVS.GB_REPO_CONFIG_REF || ``
  const remote = opts.remote || ENVS.GB_GIT_REPO_REMOTE

  if(ref) return { $ref: ref }
  if(!remote) throw new Error(`Missing required $ref for repository`)

  return { $ref: buildRefFromRemote(remote) }

}

// TODO: Investigate writing the $ref to the actual goblet config file
// Need to figure out to do that for a JS/TS file. That or switch to a JSON file, and load that instead
const addRefToConfig = (config: TGobletConfig, opts:TGobletRefOpts) => {
  return {...config, ...getRef(opts)} as TGobletConfig
}


export const ensureGobletCfg = (config: TGobletConfig, opts:TGobletRefOpts):TGobletCfgLoaderResp => {
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
