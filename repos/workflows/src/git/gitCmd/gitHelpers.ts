import type {
  TCmdResp,
  TGitOpts,
  TRunCmdOpts,
} from '@gobletqa/workflows/types'

import path from 'path'
import { URL } from 'url'
import { Logger } from '@keg-hub/cli-utils'
import { isObj, exists } from '@keg-hub/jsutils'
import { EProvider } from '@gobletqa/workflows/types'
import { throwErr } from '@gobletqa/workflows/utils/throwErr'


export const gobletRefRemote = `goblet-ref`

/**
 * Default child process options
 * @type {Object}
 */
export const defCmdOpts:TRunCmdOpts = {
  exec: true
}

/**
 * Validates the gitOpts object has the correct properties
 * @function
 * @throws
 * @param {gitOpts} gitOpts - properties to build options for a git call
 *
 * @returns {Void}
 */
export const validateGitOpts = (gitOpts:TGitOpts):TGitOpts => {
  // Ensure an object is passed
  !isObj(gitOpts)
    && throwErr(`Git command requires an options object. Received ${typeof gitOpts}`)

  ;['local', 'remote', 'branch', 'username'].map(key => {
    !gitOpts[key]
      && throwErr(`Git command requires a ${key} property and value in the git options object`)
  })

  !gitOpts.token &&
    !exists(process.env.GOBLET_GIT_TOKEN)
    && throwErr(`Git command requires a valid token.`)

  return {
    local: gitOpts.local,
    remote: gitOpts.remote,
    repoId: gitOpts.repoId,
    branch: gitOpts.branch,
    username: gitOpts.username,
    provider: gitOpts.provider,
    name: gitOpts.name || gitOpts.username,
    repoName: path.basename(gitOpts.remote),
    token: gitOpts.token || process.env.GOBLET_GIT_TOKEN,
    email: gitOpts.email || `${gitOpts.username}@goblet.io`,
  }
}

export const providerRemoteUrl = {
  [EProvider.Github]: (gitOpts:TGitOpts) => {
    const {remote, token} = gitOpts
    const url = new URL(remote)

    return `${url.protocol}//${token}@${url.host}${url.pathname}`
  },
  [EProvider.Gitlab]: (gitOpts:TGitOpts) => {
    const {remote, token} = gitOpts
    const url = new URL(remote)

    // https://oauth2:<token>@gitlab.com/project_path/project_name.git
    return `${url.protocol}//oauth2:${token}@${url.host}${url.pathname}`
  }
}

/**
 * Helper to generate the repos remote url to clone / push / pull from based on the provider
 */
export const generateRemoteUrl = (gitOpts:TGitOpts) => {
  /**
   * Default to using the github method
   * Gitlab uses an odd `oauth2:` prefix which most provider won't use
   */
  const {provider=EProvider.Github} = gitOpts

  return providerRemoteUrl[provider]
    ? providerRemoteUrl[provider](gitOpts)
    : throwErr(`Unknown Git Provider "${provider}"; repo could not be initialized`)
}

/**
 * Helper to log git command error messages
 */
export const hasGitError = (err?:Error, resp?:TCmdResp, command:string=``) => {
  let message
  if(err) message = err.message
  else if(resp?.exitCode) message = resp.error || `An unknown error occurred`

  if(!message) return false

  Logger.error(`Error running git ${command}:\n`)
  Logger.log(message)
  Logger.empty()

  return true
}

