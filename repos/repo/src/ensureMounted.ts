import type { TGitOpts, TWFArgs } from '@GGT/types'

import { git } from '@gobletqa/git'
import { Logger } from '@gobletqa/logger'
import { mountRepo } from '@gobletqa/repo/mountRepo'

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
  else if(!gitState.repo || !gitState.branch){

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

  return gitState
}
