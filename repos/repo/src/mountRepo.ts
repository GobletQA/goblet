import type { TGitOpts } from '@gobletqa/git'

import { git } from '@gobletqa/git'
import { Logger } from '@gobletqa/logger'
import { autoWatch } from '@gobletqa/git/auto'

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

  return await autoWatch(opts)
}
