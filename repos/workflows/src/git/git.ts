
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import { loadToken } from './loadToken'
import { RepoWatcher } from './repoWatcher'
import { throwErr } from '../utils/throwErr'
import { ensurePath } from '../utils/ensurePath'
import { getRepoPath } from '../utils/getRepoPath'
import { fileSys, runCmd, Logger } from '@keg-hub/cli-utils'
import { isObj, limbo, deepMerge, exists } from '@keg-hub/jsutils'
import {
  TCmdResp,
  TGitOpts,
  TGitMeta,
  TRunCmdOpts,
  TLimboCmdResp
} from '@gobletqa/workflows/types'

/**
 * Default child process options
 * @type {Object}
 */
const defCmdOpts:TRunCmdOpts = {
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
const validateGitOpts = (gitOpts:TGitOpts):TGitOpts => {
  // Ensure an object is passed
  !isObj(gitOpts) &&
    throwErr(`GitFS requires an options object. Received ${typeof gitOpts}`)
  ;['local', 'remote', 'branch', 'username'].map(key => {
    !gitOpts[key] &&
      throwErr(
        `GitFS requires a ${key} property and value in the git options object`
      )
  })

  !gitOpts.token &&
    !exists(process.env.GOBLET_GIT_TOKEN) &&
    throwErr(
      `GitFS requires a valid token property. Or set the GOBLET_GIT_TOKEN env`
    )

  return {
    local: gitOpts.local,
    remote: gitOpts.remote,
    branch: gitOpts.branch,
    username: gitOpts.username,
    name: gitOpts.name || gitOpts.username,
    token: gitOpts.token || process.env.GOBLET_GIT_TOKEN,
    email: gitOpts.email || `${gitOpts.username}@goblet.io`,
  }
}

/**
 * Helper for running git commands
 */
export const git = async (
  args:string[],
  opts?:TRunCmdOpts,
  ...params:string[]
) => {
  return await limbo(runCmd('git', args, opts, ...params)) as TLimboCmdResp
}


/**
 * Helper for loading the Git Token
 */
git.loadToken = loadToken

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
  const { local, remote, token, branch=`main` } = options

  // Ensure the repo path exists, and if not then throw
  const pathExists = await ensurePath(local)
  !pathExists && throwErr(`Unknown error, repo directory could not be created`)

  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  // Init the repo
  const [initErr, initResp] = await git([`init`], joinedOpts, local)
  if(initErr) return [initErr, initResp]

  // Checkout the desired branch
  const [chErr, chResp] = await git([`checkout`, `-b`, branch], joinedOpts, local)
  if(chErr) return [chErr, chResp]

  // Pull code from the remote url
  const url = new URL(remote)
  const gitUrl = `${url.protocol}//${token}@${url.host}${url.pathname}`
  const [err, resp] = await git([`pull`, gitUrl, branch], joinedOpts, local)
  if(err) return [err, resp]


  // If repo already exists, then just reuse it
  const alreadyExists = resp?.exitCode === 128
    && resp?.error
    && resp?.error?.includes(`already exists and is not an empty directory`)

  return alreadyExists ? [null, null] : [err, resp]
}


/**
 * Not technically a git method but relative to the repo in this context
 */
git.remove = async (args:TGitMeta) => {
  const repoPath = getRepoPath(args)

  // Stop and remove the repo watcher before removing the folder from the FS
  await RepoWatcher.remove(repoPath)
  Logger.log(`Removing repo at path ${repoPath}`)

  // Remove the repo directory
  Logger.log(`Removing repo directory...`)
  const [err] = await limbo(
    new Promise((res, rej) => {
      fs.rm(repoPath, { recursive: true, force: true }, err =>
        err ? rej(err) : res(true)
      )
    })
  )

  err && throwErr(err)
}

git.exists = async (args:TGitMeta, localPath?:string) => {
  const repoPath = localPath || getRepoPath(args)

  Logger.log(`Checking if repo is mounted at ${repoPath}`)
  const [err, pathExists] = await fileSys.pathExists(repoPath)
  err && err.code !== `ENOENT` && throwErr(err)

  return Boolean(pathExists)
}