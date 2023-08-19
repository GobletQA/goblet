import type {
  TGitOpts,
  TRunCmdOpts,
} from '@gobletqa/workflows/types'

import { git } from './gitCmd'
import { loadToken } from './loadToken'
import { Logger } from '@gobletqa/logger'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { throwErr } from '@gobletqa/workflows/utils/throwErr'
import { ensurePath } from '@gobletqa/workflows/utils/ensurePath'

import {
  defCmdOpts,
  hasGitError,
  validateGitOpts,
} from './gitHelpers'



git.setUser = async (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
) => {

  const options = validateGitOpts(gitOpts)
  const { local, email, name, username } = options
  const gitName = name || username || email.split(`@`).shift()

  // Ensure the repo path exists, and if not then throw
  const pathExists = await ensurePath(local)
  !pathExists && throwErr(`Unknown error, repo directory could not be created`)
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  Logger.info(`Configuring git user email...`)
  const [emailErr, emailResp] = await git([`config`, `user.email`, email], joinedOpts, local)
  if(hasGitError(emailErr, emailResp, `config-email`)) return [emailErr, emailResp]
  
  Logger.info(`Configuring git user name...`)
  const [nameErr, nameResp] = await git([`config`, `user.name`, gitName], joinedOpts, local)
  if(hasGitError(nameErr, nameResp, `config-name`)) return [nameErr, nameResp]

}

/**
 * Helper for loading the Git Token
 */
git.loadToken = loadToken


