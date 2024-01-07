import type { Repo } from '@GRP/repo'
import type { TGitOpts } from '@gobletqa/git'
import type { TGobletConfig } from '@GRP/types'

import { Logger } from '@gobletqa/logger'
import {decryptRepo} from './decryptRepo'

export const repoSecrets = (
  opts:TGitOpts,
  repo:Repo|TGobletConfig,
) => {

  Logger.log(`Decrypting repo secrets...`)
  const cryptoErr = decryptRepo(opts, repo)

  if(cryptoErr) throw cryptoErr
}