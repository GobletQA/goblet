import type { TGitOpts } from '../types'

import { git } from '../git'
import { latentRepo } from './latentRepo'
import { Logger } from '@gobletqa/logger'
import { ENVS } from '@gobletqa/environment'

const addTag = async (gitOpts:TGitOpts, force?:boolean) => {
  const ref = await git.hash.content({
    ...gitOpts,
    content: gitOpts.remote
  })

  if(!ref) return new Error(`[Git Hash Error] Could not generate ref from remote`)

  const [tagErr, tagResp] = await git.tag({
    ...gitOpts,
    force,
    ref,
    tag: ENVS.GB_SECRETS_TAG_REF,
  })

  if(tagErr || tagResp?.exitCode)
    return tagErr || new Error(`[Git Tag Error] ${tagResp.error || `Could not create tag from ref`}`)

  Logger.info(`Pushing new tag to remote...`)
  const pushed = await git.tag.push({
    ...gitOpts,
    force,
    tag: ENVS.GB_SECRETS_TAG_REF,
    
  })

  return !pushed && new Error(`Failed to push Goblet repo tag to remote`)

}

/**
 * Basically runs the following commands
 * `HASH_OBJ=(echo <repo-remote> | git hash-object -t blob -w --stdin)`
 * `git tag -f -a goblet-do-not-delete $HASH_OBJ -m ""`
 */
export const ensureRemoteTag = async (gitOpts:TGitOpts) => {

  const existing = await git.tag.cat({
    ...gitOpts,
    log: false,
    tag: ENVS.GB_SECRETS_TAG_REF,
  })

  // If tag does not exist, then create one
  if(!existing){
    Logger.info(`Existing goblet repo tag NOT found. Creating new tag...`)
    return await addTag(gitOpts)
  }

  // If does exist ensure it matches the existing remote
  if(existing === gitOpts.remote){
    Logger.pair(`Found existing goblet repo tag`, gitOpts.remote)
    return undefined
  }

  Logger.warn(`Goblet repo tag does not match the current repo URL, rekeying secrets...`)

  const reKeyErr = latentRepo.rekey({
    old: existing,
    update: gitOpts.remote,
    location: gitOpts.local,
  })

  if(reKeyErr) return reKeyErr

  return await addTag(gitOpts, true)
}

