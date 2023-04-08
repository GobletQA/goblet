import type {
  TCmdResp,
  TGitOpts,
  TGitMeta,
  TRunCmdOpts,
  TRepoGitState,
  TLimboCmdResp,
  TSaveMetaData,
} from '@gobletqa/workflows/types'

import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import { loadToken } from './loadToken'
import { RepoWatcher } from './repoWatcher'
import { throwErr } from '../utils/throwErr'
import { ensurePath } from '../utils/ensurePath'
import { getRepoPath } from '../utils/getRepoPath'
import { fileSys, runCmd, Logger } from '@keg-hub/cli-utils'
import { isObj, limbo, deepMerge, exists, emptyObj } from '@keg-hub/jsutils'

type TGitRemoteOpts = {
  url?:string
  origin?:string
}

type TGitRemote = {
  (
    cmdArgs:string[],
    gitOpts:TGitOpts,
    cmdOpts?:TRunCmdOpts,
  ): Promise<TLimboCmdResp>
  add: (gitOpts:TGitOpts, opts?:TGitRemoteOpts) => Promise<boolean>
  print: (gitOpts:TGitOpts, opts?:TGitRemoteOpts, cmdOpts?:TRunCmdOpts) => Promise<string>
}

type TGitBranch = {
  (
    cmdArgs:string[],
    gitOpts:TGitOpts,
    cmdOpts?:TRunCmdOpts,
  ): Promise<TLimboCmdResp>
  current: (gitOpts:TGitOpts, opts?:TGitRemoteOpts, cmdOpts?:TRunCmdOpts) => Promise<string>
}

const gobletRefRemote = `goblet-ref`

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

/**
 * Helper to generate the repos remote url to clone / push / pull from 
 */
const generateRemoteUrl = ({remote, token}:TGitOpts) => {
  const url = new URL(remote)
  return `${url.protocol}//${token}@${url.host}${url.pathname}`
}

/**
 * Helper to log git command error messages
 */
const hasGitError = (err?:Error, resp?:TCmdResp, command:string=``) => {
  let message
  if(err) message = err.message
  else if(resp?.exitCode) message = resp.error || `An unknown error occurred`

  if(!message) return false

  Logger.error(`Error running git ${command}:\n`)
  Logger.log(message)
  Logger.empty()

  return true
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

const gitCmd = async (
  args:string[],
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
) => {
  const options = validateGitOpts(gitOpts)
  return await git(args, deepMerge(defCmdOpts, cmdOpts), options.local)
}

git.cmd = gitCmd


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

  const [pullErr, pullResp] = await git.pull(gitOpts, cmdOpts)

  // Add the git remote for reference 
  await git.remote.add(gitOpts, { url: options.remote })

  // Ensure the user is configured for future git operations after pulling
  await git.setUser(gitOpts, cmdOpts)

  // Return the pull response so it can be handled by the mountRepo method
  return [pullErr, pullResp]
}

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
 * Calls git branch <method> on the local git repo
 * @function
 */
git.branch = (async (
  cmdArgs:string[],
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
) => {
  return await gitCmd([`branch`, ...cmdArgs], gitOpts, cmdOpts)
}) as TGitBranch

/**
 * Gets the current checked out branch of a local repo
 * @function
 * @example
 * git rev-parse --abbrev-ref HEAD
 */
git.branch.current = async (
  gitOpts:TGitOpts,
  opts:TGitRemoteOpts=emptyObj,
  cmdOpts:TRunCmdOpts=emptyObj
) => {

  const [err, resp] = await gitCmd(
    [`rev-parse`, `--abbrev-ref`, `HEAD`],
    gitOpts,
    cmdOpts
  )

  return hasGitError(err, resp, `branch.current`) ? `` : resp?.data?.trim()
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
 * Calls git commit --all in a subshell after building the options from the passed in args
 * @function
 *
 */
git.commit = async (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
  metaData?:TSaveMetaData
):Promise<[err:Error, resp:TCmdResp]> => {
  const message = metaData?.message || `test(goblet): auto-commit`
  const options = validateGitOpts(gitOpts)
  const { local } = options

  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  // Add all changes that currently exist
  Logger.info(`Adding all changes in repo at path ${local}`)
  const [addErr, addResp] = await git([`add`, `--all`], joinedOpts, local)
  if(hasGitError(addErr, addResp, `add`)) return [addErr, addResp]

  // Commit all changes that currently exist
  Logger.info(`Committing all staged changes in repo at path ${local}`)
  const [commitErr, commitResp ] = await git([`commit`, `-m`, `"${message}"`], joinedOpts, local)

  if(commitResp.exitCode && commitResp.data.includes(`nothing to commit`))
    return [commitErr, commitResp]

  hasGitError(commitErr, commitResp, `commit`)

  return [commitErr, commitResp]
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

/**
 * Not technically a git method but relative to the repo in this context
 * Checks to see if the repo folder exists, and if so, removes it
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

  err ? throwErr(err) : Logger.log(`Repo directory at ${repoPath} has been removed.`)
}

/**
 * Checks to see if the repo folder exists
 * Not technically a git method but relative to the repo in this context
 */
git.exists = async (args:TGitMeta, localPath?:string) => {
  const repoPath = localPath || getRepoPath(args)

  Logger.log(`Checking if repo is mounted at ${repoPath}`)
  const [err, pathExists] = await fileSys.pathExists(repoPath)
  err && err.code !== `ENOENT` && throwErr(err)

  return Boolean(pathExists)
}

/**
 * Checks the remote and current branch of a local repo if it exists
 * Ensure the current remote matches the expected remote
 * Ensure the current branch matches the expected branch
 * @function
 */
git.checkRepo = async (gitOpts:TGitOpts):Promise<TRepoGitState> => {
  const state = { repo: false, branch: false, mounted: false }

  const exists = await git.exists(null, gitOpts.local)
  if(!exists) return state
  
  state.mounted = true

  const { remote, branch, newBranch } = gitOpts
  const remoteUrl =  await git.remote.print(gitOpts)
  if(remoteUrl === remote) state.repo = true
  
  const checkBranch = newBranch || branch
  const currentBranch = await git.branch.current(gitOpts)
  if(checkBranch === currentBranch) state.branch = true

  return state
}
