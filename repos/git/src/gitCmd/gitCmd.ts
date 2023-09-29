import type { TGitExec } from './gitcmd.types'
import type {
  TGitOpts,
  TRunCmdOpts,
  TLimboCmdResp,
} from '@GGT/types'

import { runCmd } from '@keg-hub/cli-utils'
import { limbo } from '@keg-hub/jsutils/limbo'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
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
  const merged = deepMerge(defCmdOpts, cmdOpts)

  return await git(args, merged, options.local)
}

git.cmd = gitCmd
