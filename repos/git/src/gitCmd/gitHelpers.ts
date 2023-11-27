import type { TGitFetchOpts } from './gitcmd.types'
import type {
  TCmdResp,
  TGitOpts,
  TRunCmdOpts,
} from '@GGT/types'

import path from 'path'
import { URL } from 'url'
import { git } from './gitCmd'
import { Logger } from '@gobletqa/logger'
import { wait } from '@keg-hub/jsutils/wait'
import { isObj } from '@keg-hub/jsutils/isObj'
import { throwErr } from '@GGT/utils/throwErr'
import { exists } from '@keg-hub/jsutils/exists'
import { GitProviders } from '@gobletqa/environment/constants'

/**
 * Default child process options
 * @type {Object}
 */
export const defCmdOpts:TRunCmdOpts = {
  exec: true
}

const defValidateKeys = [`local`, `remote`, `branch`, `username`]

/**
 * Validates the gitOpts object has the correct properties
 * @function
 * @throws
 * @param {gitOpts} gitOpts - properties to build options for a git call
 *
 * @returns {Void}
 */
export const validateGitOpts = (
  gitOpts:TGitOpts,
  validateKeys:string[]=defValidateKeys
):TGitOpts => {
  // Ensure an object is passed
  !isObj(gitOpts)
    && throwErr(`Git command requires an options object. Received ${typeof gitOpts}`)

  validateKeys.map(key => {
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
  [GitProviders.Github]: (gitOpts:TGitOpts) => {
    const {remote, token} = gitOpts
    const url = new URL(remote)

    return `${url.protocol}//${token}@${url.host}${url.pathname}`
  },
  [GitProviders.Gitlab]: (gitOpts:TGitOpts) => {
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
  const {provider=GitProviders.Github} = gitOpts

  return providerRemoteUrl[provider]
    ? providerRemoteUrl[provider](gitOpts)
    : throwErr(`Unknown Git Provider "${provider}"; repo could not be initialized`)
}

/**
 * Helper to log git command error messages
 */
export const hasGitError = (
  err?:Error,
  resp?:TCmdResp,
  command:string=``,
  logErr:boolean=true
) => {
  let message
  if(err) message = err.message
  else if(resp?.exitCode) message = resp.error || `An unknown error occurred`

  if(!message) return false

  if(logErr){
    Logger.error(`Error running git ${command}:\n`)
    Logger.log(message)
    Logger.empty()
  }

  return true
}

/**
 * Node sometimes reports too early when a folder is removed from the file-system
 * This causes issues when trying to remount a repo over a previous one
 * As a work around we loop check if the location exists, until it does not
 */
export const loopNoExistsCheck = async (
  location:string,
  checks:number=0
) => {
  return await new Promise(async (res, rej) => {
    const exists = await git.exists(null, location)
    if(!exists) return res(true)

    if(checks > 2)
      return rej(`Failed to validate repo was removed from disk`)
    
    await wait(50)
    return await loopNoExistsCheck(location, checks + 1)
  })
}

export const buildFetchOpts = (opts:TGitFetchOpts) => {
  const {
    all,
    tags,
    force,
    prune,
    depth,
    deepen,
    update,
    append,
    verbose,
    progress,
    multiple,
    upstream,
    pruneTags,
    unshallow,
    submodules,
    ...gitOpts
  } = opts
  
  const gitArgs = []
  all && gitArgs.push(`--all`)
  tags && gitArgs.push(`--tags`)
  force && gitArgs.push(`--force`)
  prune && gitArgs.push(`--prune`)
  append && gitArgs.push(`--append`)
  verbose && gitArgs.push(`--verbose`)
  multiple && gitArgs.push(`--multiple`)
  progress && gitArgs.push(`--progress`)
  unshallow && gitArgs.push(`--unshallow`)
  pruneTags && gitArgs.push(`--prune-tags`)
  update && gitArgs.push(`--update-shallow`)
  upstream && gitArgs.push(`--set-upstream`)
  submodules && gitArgs.push(`--recurse-submodules`)
  

  exists(depth) && gitArgs.push(`--depth=${depth}`)
  exists(deepen) && gitArgs.push(`--deepen=${deepen}`)

  return { gitArgs, gitOpts }
}
