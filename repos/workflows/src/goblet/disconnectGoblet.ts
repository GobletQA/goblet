import { git }from '../git'
import { Logger }from '@keg-hub/cli-utils'
import { getRepoPath }from '../utils/getRepoPath'
import { TGitMeta } from '@GWF/types'

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

  mounted
    ? await git.remove(args)
    : Logger.warn(`[ WARNING ] Repo is not mounted`)

  return {
    unmounted: true,
    user: args?.user?.gitUser,
    mountPath: getRepoPath(args),
  }
}
