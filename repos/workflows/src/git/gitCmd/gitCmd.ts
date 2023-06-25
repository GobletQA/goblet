import type { TGitExec } from './gitcmd.types'
import type {
  TGitOpts,
  TRunCmdOpts,
  TLimboCmdResp,
} from '@gobletqa/workflows/types'

import { runCmd } from '@keg-hub/cli-utils'
import { limbo, deepMerge } from '@keg-hub/jsutils'
import { defCmdOpts, validateGitOpts } from './gitHelpers'

/**
 * Helper for running git commands
 */
export const git = (async (
  args:string[],
  opts?:TRunCmdOpts,
  ...params:string[]
) => {
  return await limbo(runCmd('git', args, opts, ...params)) as TLimboCmdResp
}) as TGitExec

export const gitCmd = async (
  args:string[],
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
) => {
  const options = validateGitOpts(gitOpts)
  return await git(args, deepMerge(defCmdOpts, cmdOpts), options.local)
}

git.cmd = gitCmd
