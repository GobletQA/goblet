import type { TGitOpts, TGobletConfig } from '@gobletqa/workflows/types'

import { latentRepo } from './latentRepo'
import { Logger } from '@keg-hub/cli-utils'
import { git } from '@gobletqa/workflows/git'
import { REPO_TAG_REF } from '@gobletqa/workflows/constants'


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
    tag: REPO_TAG_REF,
  })

  if(tagErr || tagResp?.exitCode)
    return tagErr || new Error(`[Git Tag Error] ${tagResp.error || `Could not create tag from ref`}`)

  Logger.info(`Pushing new tag to remote...`)
  const pushed = await git.tag.push({
    ...gitOpts,
    force,
    tag: REPO_TAG_REF,
    
  })

  return !pushed && new Error(`Failed to push Goblet repo tag to remote`)

}

export const ensureRemoteTag = async (gitOpts:TGitOpts, config:TGobletConfig) => {

  const existing = await git.tag.cat({
    ...gitOpts,
    log: false,
    tag: REPO_TAG_REF,
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
    updated: gitOpts.remote,
    location: gitOpts.local,
  })

  if(reKeyErr) return reKeyErr

  return await addTag(gitOpts, true)
}

