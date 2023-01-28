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
  const mounted = await git.exists(args)

    // Mount the repo if it's not mounted already
  if (!mounted) {
    Logger.log(`Mounting remote repo...`)
    await mountRepo(gitOpts)
  }

  Logger.log(`Setting up Goblet...`)
  return await setupGoblet(args, gitOpts, !mounted)
}
