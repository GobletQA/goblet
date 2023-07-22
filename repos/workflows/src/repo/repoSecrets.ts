import type { TGitOpts, TRepoOpts } from '@GWF/types'

import {decryptRepo} from './decryptRepo'
import { Logger } from '@keg-hub/cli-utils'
import { failResp } from '../goblet/response'
import {ensureRemoteTag} from './ensureRemoteTag'


export const repoSecrets = async (
  opts:TGitOpts,
  repo:TRepoOpts,
  statusCheck?:boolean
) => {

  if(!statusCheck){
    Logger.log(`Checking goblet remote tag...`)
    const tagErr = await ensureRemoteTag(opts, repo)
    if(tagErr) return failResp({ setup: false }, tagErr.message)
  }

  Logger.log(`Decrypting repo secrets...`)
  const cryptoErr = await decryptRepo(opts, repo)

  if(cryptoErr) return failResp({ setup: false }, cryptoErr.message)

}