import type { TGitOpts } from '@GWF/types'
import type { TGobletConfig } from '@gobletqa/shared'

import {decryptRepo} from './decryptRepo'
import { Logger } from '@gobletqa/logger'
import { failResp } from '../goblet/response'
import {ensureRemoteTag} from './ensureRemoteTag'


export const repoSecrets = async (
  opts:TGitOpts,
  config?:TGobletConfig,
  statusCheck?:boolean
) => {

  if(!statusCheck){
    Logger.log(`Checking goblet remote tag...`)
    const tagErr = await ensureRemoteTag(opts)
    if(tagErr) return failResp({ setup: false }, tagErr.message)
  }

  Logger.log(`Decrypting repo secrets...`)
  const cryptoErr = await decryptRepo(opts, config)

  if(cryptoErr) return failResp({ setup: false }, cryptoErr.message)

}