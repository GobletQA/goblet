import type { TGitOpts, TLimboCmdResp, TRunCmdOpts } from '@gobletqa/workflows/types'

import type {
  TGitTag,
  TGitTagOpts,
  TTagCatOpts,
  TTagListOpts,
  TTagRemoveOpts
} from './gitcmd.types'

import { git } from './gitCmd'
import { deepMerge, isStr } from '@keg-hub/jsutils'

import {
  defCmdOpts,
  hasGitError,
  validateGitOpts,
} from './gitHelpers'

const buildTagArgs = (opts:TTagListOpts) => {
  const {
    key,
    log,
    sign,
    force,
    format,
    message,
    annotate,
    ...gitOpts
  } = opts

  const gitArgs = []
  sign && gitArgs.push(`-s`)
  force && gitArgs.push(`-f`)
  annotate && gitArgs.push(`-a`)
  key && gitArgs.push(`-u`, key)
  format && gitArgs.push(`--format=${format}`)
  message && gitArgs.push(`--message=${message}`)
  
  return { gitArgs, gitOpts }
}

const gitTagCmd = async (
  gitOpts:TGitOpts,
  gitArgs:string[],
  cmdOpts?:TRunCmdOpts,
  cmd=`tag`
) => {
  const options = validateGitOpts(gitOpts)
  const { local } = options

  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)

  return await git([cmd, ...gitArgs], joinedOpts, local)
}

const tagRemove = async (
  tagOpts:TTagRemoveOpts,
  cmdOpts?:TRunCmdOpts
):Promise<TLimboCmdResp> => {
  const { tag } = tagOpts
  const {
    gitArgs,
    gitOpts
  } = buildTagArgs(tagOpts)

  gitArgs.push(`--delete`, tag)

  const [err, resp] = await gitTagCmd(gitOpts, gitArgs, cmdOpts)
  
  if(!hasGitError(err, resp, `tag`)) return [err, resp]

  const msg = resp.error || (resp?.exitCode && `An unknown error occurred`)

  return [err || new Error(msg), resp]
}

const tagList = async (
  tagOpts:TTagListOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const { list } = tagOpts
  const {
    gitArgs,
    gitOpts
  } = buildTagArgs(tagOpts)
  
  isStr(list)
    ? gitArgs.push(`--list`, list)
    : gitArgs.push(`--list`)

  return await gitTagCmd(gitOpts, gitArgs, cmdOpts)
}

const tagCat = async (
  tagOpts:TTagCatOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const { tag } = tagOpts
  const {
    gitArgs,
    gitOpts
  } = buildTagArgs(tagOpts)
  
  gitArgs.push(`blob`, tag)
  
  return await gitTagCmd(gitOpts, gitArgs, cmdOpts, `cat-file`)
}

/**
 * git tag -a tag-name tag-ref
 */
const gitTag = async (
  tagOpts:TGitTagOpts,
  cmdOpts?:TRunCmdOpts
) => {

  const { tag, ref } = tagOpts
  const { gitArgs, gitOpts } = buildTagArgs(tagOpts)

  gitArgs.push(tag, ref)

  const [err, resp] = await gitTagCmd(gitOpts, gitArgs, cmdOpts)
  
  if(!hasGitError(err, resp, `tag`)) return [err, resp]

  const msg = resp.error || (resp?.exitCode && `An unknown error occurred`)
  return [err || new Error(msg), resp]
}

/**
 * Adds a git tag to the repo, and optionally pushes the tag to a remove
 * @example
 * git tag <options>
 * git cat-file -p $some_tag
 */
git.tag = (async (
  gitOpts:TGitTagOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const { remove, list } = gitOpts

  if(remove) return tagRemove(gitOpts, cmdOpts)
  if(list) return tagList(gitOpts, cmdOpts)

  return gitTag(gitOpts, cmdOpts)
}) as TGitTag

git.tag.remove = tagRemove

git.tag.list = async (
  gitOpts:TTagListOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const [tagErr, tagResp] = await tagList(gitOpts, cmdOpts)

  return hasGitError(tagErr, tagResp, `tag-list`)
    ? undefined
    : tagResp.data.split(`\n`)
        .reduce((acc, item:string) => {
          const cleaned = item.trim()
          cleaned && acc.push(cleaned)

          return acc
        }, [])
}


/**
 * Print the output of the hashed tag
 */
git.tag.cat = async (
  gitOpts:TTagCatOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const [tagErr, tagResp] = await tagCat(gitOpts, cmdOpts)

  return hasGitError(tagErr, tagResp, `tag-cat`)
    ? undefined
    : tagResp?.data?.trim()
}
