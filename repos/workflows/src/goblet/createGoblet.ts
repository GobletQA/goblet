import type { TGitOpts, TWFCreateArgs } from '@gobletqa/workflows/types'

import { Logger } from '@keg-hub/cli-utils'
import { git } from '@gobletqa/workflows/git'
import { GitApi } from '@gobletqa/workflows/repo/gitApi'
import { mountRepo } from '@gobletqa/workflows/repo/mountRepo'
import { setupGoblet } from '@gobletqa/workflows/goblet/setupGoblet'
import { validateCreateArgs } from '@gobletqa/workflows/utils/validateCreateArgs'
import { configureGitOpts } from '@gobletqa/workflows/utils/configureGitOpts'
import { ensureBranchExists } from '@gobletqa/workflows/repo/ensureBranchExists'

export const createGoblet = async (args:TWFCreateArgs) => {
  
  Logger.subHeader(`Running Create Repo Goblet Workflow`)

  const token = git.loadToken(args)
  const gitOpts = await configureGitOpts({ ...args, token })
  const gitApi = new GitApi(gitOpts)

  const notValid = validateCreateArgs(token, gitOpts)
  if(notValid) return notValid


  // TODO: implement create repo here

  const createResp = {
    mounted:  false,
    setup: false,
    message: `Create repo not implemented!`,
    repo: {}
  }

  createResp.mounted && createResp.setup
    ? Logger.success(`Finished running Initialize Goblet Workflow`)
    : Logger.error(
        Logger.colors.red(`Failed Initialize Goblet Workflow\n`),
        Logger.colors.white(`\t- Repo Mount: ${createResp.mounted}\n`),
        Logger.colors.white(`\t- Repo Setup: ${createResp.setup}\n`)
      )

  return createResp

}