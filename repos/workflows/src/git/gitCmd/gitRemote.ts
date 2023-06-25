import type {
  TGitRemote,
  TGitRemoteOpts
} from './gitcmd.types'

import type {
  TGitOpts,
  TCmdResp,
  TRunCmdOpts,
} from '@gobletqa/workflows/types'


import { git, gitCmd } from './gitCmd'
import { Logger } from '@keg-hub/cli-utils'
import { emptyObj, deepMerge } from '@keg-hub/jsutils'
import { throwErr } from '@gobletqa/workflows/utils/throwErr'
import { ensurePath } from '@gobletqa/workflows/utils/ensurePath'
import {
  defCmdOpts,
  generateRemoteUrl,
} from './gitHelpers'

import {
  hasGitError,
  validateGitOpts,
  gobletRefRemote,
} from './gitHelpers'


/**
 * Calls git remote <method> on the local git repo
 * @function
 */
git.remote = (async (
  cmdArgs:string[],
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
) => {
  return await gitCmd([`remote`, ...cmdArgs], gitOpts, cmdOpts)
}) as TGitRemote

/**
 * Calls git remote add, to add a remote url to the local git repo
 * @function
 */
git.remote.add = async (
  gitOpts:TGitOpts,
  opts:TGitRemoteOpts=emptyObj
) => {
  const options = validateGitOpts(gitOpts)
  const url = opts?.url || options.remote
  const origin = opts?.origin || gobletRefRemote

  const [err, resp] = await git.remote([`add`, origin, url], options)

  return !hasGitError(err, resp, `remote.add`)
}

/**
 * Calls git remote add, to add a remote url to the local git repo
 * @function
 * @example
 * git config --get remote.goblet-ref.url
 */
git.remote.print = async (
  gitOpts:TGitOpts,
  opts:TGitRemoteOpts=emptyObj,
  cmdOpts:TRunCmdOpts=emptyObj
) => {
  const origin = opts?.origin || gobletRefRemote
  const [err, resp] = await gitCmd(
    [`config`, `--get`, `remote.${origin}.url`],
    gitOpts,
    cmdOpts
  )

  return hasGitError(err, resp, `remote.print`) ? `` : resp?.data?.trim()
}

/**
 * Calls git clone in a subshell after building the options from the passed in args
 * @function
 *
 */
git.clone = async (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts
):Promise<[err:Error, resp:TCmdResp]> => {
  const options = validateGitOpts(gitOpts)
  const { local, branch } = options

  // Ensure the repo path exists, and if not then throw
  const pathExists = await ensurePath(local)
  !pathExists && throwErr(`Unknown error, repo directory could not be created`)

  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  // Init the repo
  const [initErr, initResp] = await git([`init`], joinedOpts, local)
  if(hasGitError(initErr, initResp, `init`)) return [initErr, initResp]

  // Checkout the desired branch
  const [chErr, chResp] = await git([`checkout`, `-b`, branch], joinedOpts, local)
  if(hasGitError(chErr, chResp, `checkout`)) return [chErr, chResp]

  // TODO: maybe try one of these to clean things up?
  // Might fix the mount / remount issue
  // git gc --prune=now
  // git remote prune origin

  const [pullErr, pullResp] = await git.pull(gitOpts, cmdOpts)

  // Add the git remote for reference 
  await git.remote.add(gitOpts, { url: options.remote })

  // Ensure the user is configured for future git operations after pulling
  await git.setUser(gitOpts, cmdOpts)
  
  /**
   * TODO - May need to do this in some cases, need to investigate
   * `git remote prune origin`
   * Get the following error
   * ```
      remote: error: cannot lock ref 'refs/heads/goblet-lancetipton': is at a623b18f626481aa04a467b50062f541c926d3b5 but expected a39fb6395a7aea29168cb0df9667fd35e78b66f5
      To https://gitlab.com/tiptondigital/simple-who.git
      ! [remote rejected] goblet-lancetipton -> goblet-lancetipton (failed to update ref)
      error: failed to push some refs to 'https://@gitlab.com/...'
   * ```
   * Need to investigate
 */

  // Return the pull response so it can be handled by the mountRepo method
  return [pullErr, pullResp]
}


/**
 * Calls git pull in a subshell after building the options from the passed in args
 * @function
 *
 */
git.pull = async (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts
):Promise<[err:Error, resp:TCmdResp]> => {

  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  const options = validateGitOpts(gitOpts)
  const { local, branch } = options
  
  // Pull code from the remote url
  const gitUrl = generateRemoteUrl(options)
  const [err, resp] = await git([`pull`, gitUrl, branch], joinedOpts, local)
  if(hasGitError(err, resp, `pull`)) return [err, resp]

  // If repo already exists, then just reuse it
  const alreadyExists = resp?.exitCode === 128
    && resp?.error
    && resp?.error?.includes(`already exists and is not an empty directory`)

  return alreadyExists ? [null, null] : [err, resp]
}

/**
 * Calls git pull in a subshell after building the options from the passed in args
 * @function
 *
 */
git.push = async (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts
):Promise<[err:Error, resp:TCmdResp, saved:boolean]> => {

  const options = validateGitOpts(gitOpts)
  const { local, branch, remote } = options
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  const gitUrl = generateRemoteUrl(options)
  Logger.info(`Pushing changes to repo remote ${remote}`)
  const [err, resp] = await git([`push`, gitUrl, branch], joinedOpts, local)

  return hasGitError(err, resp, `push`)
    ? [err, resp, false]
    : [err, resp, true]

}