import type { TGitOpts, TGobletConfig } from '../../workflows/src/types'

import { LatentRepo } from './latentRepo'
import { getPathFromConfig } from '@gobletqa/goblet'

export const decryptRepo = (gitOpts:TGitOpts, config?:TGobletConfig) => {
  const location = getPathFromConfig(`environmentsDir`, config)

  const latentRepo = new LatentRepo()
  const loaded = latentRepo.decrypt({
    location,
    // @ts-ignore
    ref: config?.$ref,
    // @ts-ignore
    remote: gitOpts.remote || config?.$remote,
    // file?:TLatentFile
    // token?:TLatentTokenOpts
    // environment?:ELatentEnv
    // crypto?:TLatentCryptoOpts
  })

  return !loaded
    && new Error(`Failed to decrypt repo secrets`)

}
