import path from 'path'
import { throwErr } from './throwErr'
import { getRepoPath } from '@gobletqa/git'
import { isObj } from '@keg-hub/jsutils/isObj'
import { isStr } from '@keg-hub/jsutils/isStr'
import { TWFArgs, TGitOpts } from '@gobletqa/workflows/types'

const formatBranch = (branch:string) => {
  return branch.trim()
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/\s]/gi, `-`)
}

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
export const configureGitOpts = async (args:TWFArgs) => {
  const { repo, user, token } = args

  // Ensure the models were passed in
  !isObj(repo) && throwErr(`Missing repo object model`)
  !isObj(user) && throwErr(`Missing user object model`)

  const local = getRepoPath(args)
  const {
    repoId,
    branch,
    provider,
    newBranch,
    url:remote,
    branchFrom
  } = repo
  const { email, gitUser, token:userToken } = user

  return {
    local,
    email,
    remote,
    repoId,
    provider,
    username: gitUser,
    name: path.basename(local),
    branch: formatBranch(branch),
    branchFrom: Boolean(branchFrom),
    repoName: path.basename(remote),
    token: token || userToken || process.env.GOBLET_GIT_TOKEN,
    newBranch: isStr(newBranch) ? formatBranch(newBranch) : ``,
  } as TGitOpts
}
