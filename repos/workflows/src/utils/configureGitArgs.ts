import path from 'path'
import { throwErr } from './throwErr'
import { getRepoPath } from './getRepoPath'
import { isObj, isStr } from '@keg-hub/jsutils'

import { TWFArgs, TGitOpts } from '@gobletqa/workflows/types'

/**
 * Builds the arguments required for syncing a git repo
 * Expects the passed in objects to match the models from Goblet-Admin
 * @function
 * @throws
 *
 * @param {Object} args
 *
 * @returns {Object} - Built git args
 */
export const configureGitArgs = async (args:TWFArgs) => {
  const { repo, user, token } = args

  // Ensure the models were passed in
  !isObj(repo) && throwErr(`Missing repo object model`)
  !isObj(user) && throwErr(`Missing user object model`)

  const local = getRepoPath(args)
  const { branch, url:remote, newBranch, branchFrom } = repo
  const { email, gitUser, token:userToken } = user

  return {
    local,
    email,
    branch,
    remote,
    username: gitUser,
    name: path.basename(local),
    branchFrom: Boolean(branchFrom),
    newBranch: isStr(newBranch) ? newBranch : ``,
    token: token || userToken || process.env.GOBLET_GIT_TOKEN,
  } as TGitOpts
}
