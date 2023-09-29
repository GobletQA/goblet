import type { TGitOpts } from '@GGT/types'
import type { TGobletConfig } from '@gobletqa/shared'

import { Logger } from '@gobletqa/logger'
import {decryptRepo} from './decryptRepo'
import {ensureRemoteTag} from './ensureRemoteTag'


export const repoSecrets = async (
  opts:TGitOpts,
  config:TGobletConfig,
  statusCheck?:boolean
) => {
  if(config?.$ref) Logger.success(`Goblet config has $ref, skipping remote tag`)

  else if(!statusCheck){
    Logger.log(`Checking goblet remote tag...`)
    const tagErr = await ensureRemoteTag(opts)
    if(tagErr) throw tagErr
  }

  Logger.log(`Decrypting repo secrets...`)
  const cryptoErr = await decryptRepo(opts, config)

  if(cryptoErr) throw cryptoErr
}