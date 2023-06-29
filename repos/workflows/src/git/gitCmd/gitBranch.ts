import type {
  TGitBranch,
  TGitRemoteOpts
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
