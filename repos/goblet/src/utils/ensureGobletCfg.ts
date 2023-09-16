import type { TGitData, TGobletConfig } from '../types'

import path from 'path'
import { URL } from 'url'
import { promises as fs } from 'fs'
import { ENVS } from '@gobletqa/environment'
import { GobletConfigRef } from '@gobletqa/environment/constants'

export type TGobletRefOpts = {
  ref?:string
  remote?:string
  repoRoot:string
  location:string
}

/**
 * By default uses the repos `/org/repo-name` to set the $ref
 * This makes it more transferable then using the full remote
 * But really the ref could be anything, as long as it exists and is consistent
 */
export const buildRefFromRemote = (remote:string) => {
  const url = new URL(remote)
  return url.pathname.replace(/\.git$/, ``)
}

/**
 * This ensure the $ref is set in the repos Goblet Config
 * Might be a good idea to add a check afterwards to ensure it was properly replaced
 * But that would require loading the config from disk, which would slow the process down a lot
 * Leaving out for now, but may need to add later
 */
export const replaceGobletConfigRef = async (gitData:TGitData) => {
  const cfgLoc = path.join(gitData.local, `goblet.config.ts`)
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

export const ensureGobletCfg = (config: TGobletConfig, opts:TGobletRefOpts):TGobletConfig => {
  const { repoRoot } = opts

  // Ensure the repoRoot path gets set
  // This should never happen because it's enforce when the repo is mounted
  // But its a hold over from the past
  // So keeping it for now until I can validate it's not needed
  !config?.paths?.repoRoot
    && (config.paths = {...config?.paths, repoRoot })

  return config?.$ref && config?.$ref !== GobletConfigRef
    ? config
    : addRefToConfig(config, opts)
}
