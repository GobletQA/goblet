import type { TGitMeta } from '@gobletqa/git'

import { Logger } from '@gobletqa/logger'
import { git, getRepoPath }from '@gobletqa/git'
import { killWatcher } from '@gobletqa/git/auto'

/**
 * Workflow to unmount a repo based on a users name
 * @function
 * @public
 * @throws
 * @example
 *
 * @param {Object} args
 * @param {Object} args.user - User model object
 * @param {string} args.user.gitUser - Name of the user
 *
 * @returns {Object} - Mount state of the repo
 */
export const disconnectGoblet = async (args:TGitMeta) => {

  const mounted = await git.exists(args)
  const mountPath = getRepoPath(args)

  if(mounted){
    killWatcher(mountPath)
    await git.remove(args)
  }
  else Logger.warn(`[ WARNING ] Repo is not mounted`)

  return {
    mountPath,
    unmounted: true,
    user: args?.user?.gitUser,
  }
}
