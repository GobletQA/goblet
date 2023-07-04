import type {
  TGitBranch,
  TGitRemoteOpts,
  TGitCreateBranch,
} from './gitcmd.types'

import type {
  TGitOpts,
  TRunCmdOpts,
  TLimboCmdResp,
} from '@gobletqa/workflows/types'

import { git, gitCmd } from './gitCmd'
import { hasGitError } from './gitHelpers'
import { emptyObj } from '@keg-hub/jsutils'



/**
 * Calls git branch <method> on the local git repo
 * @function
 */
git.branch = (async (
  cmdArgs:string[],
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
) => {
  return await gitCmd([`branch`, ...cmdArgs], gitOpts, cmdOpts)
}) as TGitBranch

/**
 * Gets the current checked out branch of a local repo
 * @function
 * @example
 * git rev-parse --abbrev-ref HEAD
 */
git.branch.current = async (
  gitOpts:TGitOpts,
  opts:TGitRemoteOpts=emptyObj,
  cmdOpts:TRunCmdOpts=emptyObj
) => {

  const [err, resp] = await gitCmd(
    [`rev-parse`, `--abbrev-ref`, `HEAD`],
    gitOpts,
    cmdOpts
  )

  return hasGitError(err, resp, `branch.current`) ? `` : resp?.data?.trim()
}

git.branch.create = async (
  gitOpts:TGitCreateBranch,
  cmdOpts:TRunCmdOpts=emptyObj
) => {

  const { newBranch, force, reset } = gitOpts
  const args = []
  force && args.push(`--force`)
  reset ? args.push(`-B`) : args.push(`-b`)

  const [err, resp] = await gitCmd(
    [`checkout`, ...args, newBranch],
    gitOpts,
    cmdOpts
  )

  return hasGitError(err, resp, `branch.create`) ? `` : resp?.data?.trim()
}
