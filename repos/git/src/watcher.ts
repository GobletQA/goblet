import type {
  EProvider,
  TGitOpts,
  TRepoWatchCb,
  TGitWatchOpts,
  TSaveMetaData,
} from '@GGT/types'

import { git } from './gitCmd/index'
import { Logger } from '@gobletqa/logger'
import { RepoWatcher } from './repoWatcher'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { throttleLast } from '@keg-hub/jsutils/throttleLast'
import { validateWatchArgs } from '@GGT/utils/validateWatchArgs'

/**
 * Helper to call git.commit and git.push to save repo changes to a git remote
 */
const saveFromShell = async (
  opts:TGitOpts,
  metaData:TSaveMetaData,
  retry:number=0
) => {
  Logger.info(`Saving changes to git remote....`)

  // Fist add and commit all the changes
  const [commitErr, commitResp] = await git.commit(opts, undefined, metaData)

  if(commitResp.exitCode && commitResp.data.includes(`nothing to commit`))
    return Logger.info(`Repo up to date\n`)

  // Next push all changes to the origin
  const [err, resp, saved] = await git.push(opts)
  if(saved) return Logger.success(`Saved repo changes successfully\n`)

  if(retry < 1 && (err?.message?.includes(`cannot lock ref`) || resp?.error?.includes(`cannot lock ref`))){
    Logger.info(`Running git gc prune ...`)
    await git.gc(opts.local)

    return await saveFromShell(opts, metaData, retry + 1)
  }

  return Logger.error(`Failed to save repo changes\n`)
}

const onFileChange:TRepoWatchCb = throttleLast(async (event, path, repoWatcher) => saveFromShell(
  repoWatcher.options,
  { message: `test(goblet): ${path} - ${event} auto-commit`}
), 4000)


export const watcher = async (opts:TGitWatchOpts=emptyObj) => {
  const {
    name=process.env.GB_GIT_REPO_WATCH_NAME,
    token=process.env.GB_GIT_REPO_WATCH_TOKEN,
    remote=process.env.GB_GIT_REPO_WATCH_REMOTE,
    branch=process.env.GB_GIT_REPO_WATCH_BRANCH,
    username=process.env.GB_GIT_REPO_WATCH_USER,
    local=process.env.GB_GIT_REPO_WATCH_LOCATION,
    provider=process.env.GB_GIT_REPO_WATCH_PROVIDER as EProvider,
  } = opts

  const options = {
    local,
    token,
    name,
    remote,
    branch,
    username,
    provider,
  }

  validateWatchArgs(options)

  return RepoWatcher.create(options, {autoStart: true, onEvent: onFileChange })

}



