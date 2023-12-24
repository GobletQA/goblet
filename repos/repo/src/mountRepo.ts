import type { TGitOpts, TSaveMetaData, TRepoWatchCb } from '@gobletqa/git'

import { Logger } from '@gobletqa/logger'
import { git, RepoWatcher } from '@gobletqa/git'
import { throttleLast } from '@keg-hub/jsutils/throttleLast'

/**
 * Helper to call git.commit and git.push to save repo changes to a git remote
 */
const saveFromShell = async (opts:TGitOpts, metaData:TSaveMetaData, retry:number=0) => {
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

/**
 * Helper to create an instance of the RepoWatcher based on the passed in git options
 * Called when a new repo is mounted, or after git-repo-status api call
 */
export const createRepoWatcher = (
  opts:TGitOpts,
  autoStart:boolean=true
) => RepoWatcher.create(opts, {autoStart, onEvent: onFileChange })

/**
 * Workflow for cloning a git repo from a git provider
 * @function
 * @public
 * @throws
 *
 */
export const mountRepo = async (opts:TGitOpts) => {
  const [err, output] = await git.clone(opts)

  if (err) throw err

  if (output?.exitCode)
    throw new Error(`Could not mount repository\n${output?.error || output?.data || ''}`)

  else Logger.log(`Repo successfully mounted`)

  createRepoWatcher(opts)
}
