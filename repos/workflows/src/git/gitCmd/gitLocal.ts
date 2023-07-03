import type {
  TCmdResp,
  TGitOpts,
  TGitMeta,
  TRunCmdOpts,
  TRepoGitState,
  TSaveMetaData,
} from '@gobletqa/workflows/types'

import fs from 'fs'
import { git } from './gitCmd'
import { RepoWatcher } from '../repoWatcher'
import { fileSys, Logger } from '@keg-hub/cli-utils'
import { limbo, deepMerge } from '@keg-hub/jsutils'
import { throwErr } from '@gobletqa/workflows/utils/throwErr'
import { getRepoPath } from '@gobletqa/workflows/utils/getRepoPath'

import {
  defCmdOpts,
  hasGitError,
  validateGitOpts,
  loopNoExistsCheck,
} from './gitHelpers'


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
 * Not technically a git method but relative to the repo in this context
 * Checks to see if the repo folder exists, and if so, removes it
 */
git.remove = async (args:TGitMeta) => {
  const repoPath = getRepoPath(args)

  // Stop and remove the repo watcher before removing the folder from the FS
  await RepoWatcher.remove(repoPath)
  Logger.log(`Removing repo at path ${repoPath}`)

  // Clear any cache before remove the directory
  // Ensure git doesn't lose it by force removing the repo
  await git.clearCache(repoPath)

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

  const [exErr] = await limbo(loopNoExistsCheck(repoPath))
  exErr && throwErr(err)

  Logger.log(`Repo directory at ${repoPath} has been removed.`)
}

/**
 * Checks to see if the repo folder exists
 * Not technically a git method but relative to the repo in this context
 */
git.exists = async (args:TGitMeta, localPath?:string) => {
  const repoPath = localPath || args && getRepoPath(args)

  if(!repoPath){
    Logger.log(`Can not find repo path, assuming repo is unmounted`)
    return false
  }

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

git.clearCache = async (
  location:string,
  cmdOpts?:TRunCmdOpts,
) => {
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  const [err, resp] = await git([`rm`, `-r`, `--cached`, `.`], joinedOpts, location)
  hasGitError(err, resp, `clear.cache`)

  return [err, resp]
}


git.gc = async (
  location:string,
  cmdOpts?:TRunCmdOpts,
) => {
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)
  const [err, resp] = await git([`gc`, `--prune=now`], joinedOpts, location)
  hasGitError(err, resp, `gc`)

  return [err, resp]
}


git.merge = async (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
  metaData?:TSaveMetaData
) => {

  const options = validateGitOpts(gitOpts)
  const { local } = options
  
  const {
    arg,
    from,
    message,
  } = metaData
  // git merge origin/main -Xours -m "Goblet Sync branches - main-into-goblet-HerrSchultz -Xours"
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)
  const [err, resp] = await git([
    `merge`,
    from,
    arg,
    `-m`,
    message
  ], joinedOpts, local)
  
  if(resp.exitCode && resp.data.includes(`nothing to commit`))
    return [err, resp]

  hasGitError(err, resp, `commit`)

  return [err, resp]
}
