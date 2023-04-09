import type { TGitOpts, TWFArgs, TRepoGitState } from '@gobletqa/workflows/types'

import { Logger } from '@keg-hub/cli-utils'
import { git } from '@gobletqa/workflows/git'
import { mountRepo } from '@gobletqa/workflows/repo/mountRepo'
import { setupGoblet } from '@gobletqa/workflows/goblet/setupGoblet'

export const ensureMounted = async (
  args:TWFArgs,
  gitOpts:TGitOpts
) => {

  // Ensure the repo is not already mounted before trying to mount it
  const gitState = await git.checkRepo(gitOpts)

  /**
   * Mount the repo if it's not mounted already
   */
  if (!gitState.mounted) {
    Logger.log(`Mounting remote repo...`)
    await mountRepo(gitOpts)
    gitState.mounted = true
  }

  /**
   * There's some kind of odd caching issue going on
   * When a previous repo was mounted, then unmounted
   * The next mounted repo throws errors when syncing the file system
   * It can't seem to find the file on disk even though they exist
   *
   * We should be able to just check the gitState.mounted state
   * And if true, skip this part
   * But due to the above caching issue, we have to un-mount, then re-mount
   * Which seems to fix the cache issue
   */
  // if(!gitState.mounted && (!gitState.repo || !gitState.branch)){

  if(!gitState.repo || !gitState.branch){

    // Only log this when wrong repo is mounted, not when mounting and re-mounting
    if(!gitState.mounted)
      Logger.log(`Incorrect repo mounted. Removing and mounting correct repo...`)

    /**
     * If a repo is mounted, but it's the wrong one, or branch if wrong
     * Then remove it, and mount the correct repo
     */
    await git.remove(args)
    await mountRepo(gitOpts)
    gitState.mounted = true
  }

  Logger.log(`Setting up Goblet...`)
  return await setupGoblet(args, gitOpts, gitState.mounted)
}
