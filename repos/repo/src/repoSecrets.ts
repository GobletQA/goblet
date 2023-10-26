import type { TGitOpts } from '@GGT/types'
import type { Repo } from '@gobletqa/repo'
import type { TGobletConfig } from '@gobletqa/shared'

import { Logger } from '@gobletqa/logger'
import {decryptRepo} from './decryptRepo'
import {ensureRemoteTag} from './ensureRemoteTag'


export const repoSecrets = async (
  opts:TGitOpts,
  repo:Repo|TGobletConfig,
  statusCheck?:boolean
) => {
  if(repo?.$ref) Logger.success(`Goblet Repo has $ref, skipping remote tag`)

  else if(!statusCheck){
    Logger.log(`Checking goblet remote tag...`)
    const tagErr = await ensureRemoteTag(opts)
    if(tagErr) throw tagErr
  }

  Logger.log(`Decrypting repo secrets...`)
  const cryptoErr = await decryptRepo(opts, repo)

  if(cryptoErr) throw cryptoErr
}