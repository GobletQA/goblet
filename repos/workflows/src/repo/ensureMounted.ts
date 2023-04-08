import type { TGitOpts, TWFArgs } from '@gobletqa/workflows/types'

import { Logger } from '@keg-hub/cli-utils'
import { git } from '@gobletqa/workflows/git'
import { mountRepo } from '@gobletqa/workflows/repo/mountRepo'
import { setupGoblet } from '@gobletqa/workflows/goblet/setupGoblet'

export const ensureMounted = async (
  args:TWFArgs,
  gitOpts:TGitOpts
) => {

  // Ensure the repo is not already mounted before trying to mount it
  const { mounted, repo, branch } = await git.checkRepo(gitOpts)

  /**
   * Mount the repo if it's not mounted already
   */
  if (!mounted) {
    Logger.log(`Mounting remote repo...`)
    await mountRepo(gitOpts)
  }

  /**
   * If a repo is mounted, but it's the wrong one, or branch if wrong
   * Then remove it, and mount the correct repo
   */
  else if(!repo || !branch){
    Logger.log(`Incorrect repo mounted. Removing and mounting correct repo...`)
    await git.remove(args)
    await mountRepo(gitOpts)
  }

  Logger.log(`Setting up Goblet...`)
  return await setupGoblet(args, gitOpts, !mounted)
}
