const path = require('path')
import { throwErr } from './throwErr'
import { ensurePath } from './ensurePath'
import { getRepoPath } from './getRepoPath'
import { isObj, exists, isStr } from '@keg-hub/jsutils'

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

  const repoPath = getRepoPath(args)

  const branchCreate = repo?.createBranch
  const createBranch = exists(branchCreate) ? branchCreate : true

  // Ensure the repo path exists, and if not then throw
  const pathExists = await ensurePath(repoPath)
  !pathExists && throwErr(`Repo directory could not be created`)

  return {
    createBranch,
    local: repoPath,
    remote: repo.url,
    email: user.email,
    branch: repo.branch,
    username: user.gitUser,
    name: path.basename(repoPath),
    newBranch: isStr(repo.newBranch) && repo.newBranch,
    token: token || repo.token || user.token || process.env.GOBLET_GIT_TOKEN,
  } as TGitOpts
}
