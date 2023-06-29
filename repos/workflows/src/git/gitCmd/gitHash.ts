import type {
  TGitHash,
  TGitHashOpts
} from './gitcmd.types'
import type {
  TRunCmdOpts,
  TLimboCmdResp
} from '@gobletqa/workflows/types'

import { git } from './gitCmd'
import { runCmd } from '@keg-hub/cli-utils'
import { limbo, deepMerge } from '@keg-hub/jsutils'
import {
  defCmdOpts,
  hasGitError,
  validateGitOpts,
} from './gitHelpers'

const buildHashArgs = (opts:TGitHashOpts) => {
  const {
    log,
    type,
    location,
    path:gPath,
    content,
    write=true,
    filters=false,
    literally=false,
    ...gitOpts
  } = opts

  const gitArgs = []
  type && gitArgs.push(`-t`, type)
  write && gitArgs.push(`-w`)
  literally && gitArgs.push(`--literally`)
  gPath && gitArgs.push(`--path`, gPath)
  
  return { gitArgs, gitOpts }
}

const hashContent = async (
  args:TGitHashOpts,
  cmdOpts?:TRunCmdOpts
):Promise<TLimboCmdResp> => {
  const { content } = args
  const { gitArgs, gitOpts } = buildHashArgs(args)
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  const options = validateGitOpts(gitOpts)
  const { local } = options

  const cmdArgs = [
    `echo`,
    content,
    `|`,
    `git`,
    `hash-object`,
    ...gitArgs,
    `--stdin`,
  ]

  const [err, resp] = await limbo(runCmd(
    `sh -c "${cmdArgs.join(` `)}"`,
    [],
    joinedOpts,
    local
  )) as TLimboCmdResp

  return [
    err,
    { ...resp, data: resp?.data?.trim?.() || resp?.data }
  ]
}

const hashFile = async (
  args:TGitHashOpts,
  cmdOpts?:TRunCmdOpts
):Promise<TLimboCmdResp> => {
  const { gitArgs, gitOpts } = buildHashArgs(args)
  const options = validateGitOpts(gitOpts)
  const { local } = options

  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)
  const [err, resp] = await git([`hash-object`, ...gitArgs], joinedOpts, local)

  return [
    err,
    { ...resp, data: resp?.data?.trim?.() || resp?.data }
  ]
  
}

/**
 * Generates a hash object from the passed in location of string content
 * @example
 * git hash-object <options>
 */
git.hash = (async (
  args:TGitHashOpts,
  cmdOpts?:TRunCmdOpts
) => {

  const { content, location } = args

  if(content) return await hashContent(args, cmdOpts)

  if(location)  return await hashFile(args, cmdOpts)

  throw new Error(`Git hash requires a file location or content argument`)

}) as TGitHash


git.hash.content = async (
  args:TGitHashOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const [hashErr, hashResp] = await hashContent(args, cmdOpts)

  return hasGitError(hashErr, hashResp, `hash-content`)
    ? undefined
    : hashResp.data
}

git.hash.file = async (
  args:TGitHashOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const [hashErr, hashResp] = await hashFile(args, cmdOpts)

  return hasGitError(hashErr, hashResp, `hash-file`)
    ? undefined
    : hashResp.data.trim()
}
