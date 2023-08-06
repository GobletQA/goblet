import type { TWFGobletConfig, TWFResp, TGitOpts, } from '@gobletqa/workflows/types'

import { Logger } from '@keg-hub/cli-utils'
import { emptyObj } from '@keg-hub/jsutils'
import { git, RepoWatcher } from '@gobletqa/workflows/git'
import { getGitApi } from '@gobletqa/workflows/providers/getGitApi'
import { GitRemoteRef, GitResetBranch } from '@gobletqa/workflows/constants'


const emptyOpts = emptyObj as TGitOpts

export const syncGoblet = async (
  config:TWFGobletConfig,
  opts:TGitOpts
) => {
  Logger.subHeader(`Running Sync Goblet Workflow`)
  
  // TODO: update this to come form an input option
  const arg = `Xours`
  
  const {
    local,
    remote,
    branch,
    username,
    repoName,
    branchFrom,
  } = opts

  const unknownStatus:TWFResp = {
    mode: 'vnc',
    setup: false,
    mounted: false,
    status: 'unknown',
    message: `Repo status is unknown, can not sync changes`
  }

  if (!username && !branch && !remote && !local) return unknownStatus

  /*
   * Use local to find the goblet.config
   * Load the goblet config and build the repo
   * respond with status and loaded repo
   */
  const isMounted = await git.exists(null, local)
  if (!isMounted) return unknownStatus

  const GitApi = getGitApi(opts)
  const gitApi = new GitApi(opts)

  RepoWatcher.remove(local)
  const syncFrom = branchFrom || await gitApi.defaultBranch(repoName)

  await git.branch.create({
    ...opts,
    reset: true,
    newBranch: GitResetBranch
  })

  const [mergeErr, mergeResp] = await git.merge(opts, {}, {
    arg,
    from: `${GitRemoteRef}/${branchFrom}`,
    message: `[Goblet Sync] <${branchFrom}>-<${arg}>-<${branch}>`
  })



  /**
   * Steps to sync changes
   * 1. Kill the `RepoWatcher` if it exists
   * 2. Get the branch to `sync-to`, or use the current mounted repo branch
   * 3. Get the branch to `sync-from`, or use the default branch of the repo
   * 4. Create a new branch from `sync-to` branch `sync-temp`
   *   - Use this branch to do the merging with the `sync-from` branch
   * 5. Add arg that sets `-Xours` or `-Xtheirs`, is passed in from API
   * 6. Use `arg`, newly created `sync-to` branch and `sync-from` branch in a `git merge` command
   *   - Execute command and capture any errors
   *   - `git merge origin/<sync-from> -Xours -m "[Goblet Sync] main-<Xours>-<sync-to>"`
   *   - Using the `arg` should solve most of these
   * 7. Respond with status, and wait for user to respond with `keep-changes` or `revert-changes`
   * 8. If user responds with `keep-changes`
   *   - Next `merge` the `sync-temp` branch into the original `sync-to` branch
   *   - `git merge <sync-temp> -Xtheirs`
   *   - Push the changes of the `sync-to` branch to the remote Git Provider
   *   - `git push origin <sync-to>`
   *   - Start `RepoWatcher`
   *   - Respond with `200` status
   * 9. If user responds with `revert-changes`
   *   - Checkout the original `sync-to` branch
   *   - Delete the newly created `merge-branch`
   *   - Start `RepoWatcher`
   *   - Respond with `200` status
   */

}