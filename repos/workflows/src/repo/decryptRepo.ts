import type { TGitOpts, TGobletConfig } from '../types'


import { latentRepo } from './latentRepo'
import { getPathFromConfig } from '@gobletqa/goblet'

export const decryptRepo = (gitOpts:TGitOpts, config?:TGobletConfig) => {
  const location = getPathFromConfig(`environmentsDir`, config)

  const loaded = latentRepo.decrypt({
    location,
    remote: gitOpts.remote,
    // file?:TLatentFile
    // token?:TLatentTokenOpts
    // environment?:ELatentEnv
    // crypto?:TLatentCryptoOpts
  })

  return !loaded
    && new Error(`Failed to decrypt repo secrets`)

}
