import type { TGitOpts, TGobletConfig } from '@gobletqa/workflows/types'


import { latentRepo } from '@gobletqa/shared/repo/latentRepo'
import { getPathFromConfig } from '@gobletqa/shared/utils/getPathFromConfig'

export const decryptRepo = (gitOpts:TGitOpts, config:TGobletConfig) => {
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
