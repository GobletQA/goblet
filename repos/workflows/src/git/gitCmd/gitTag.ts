import type {
  TCmdResp,
  TGitOpts,
  TRunCmdOpts,
  TLimboCmdResp,
} from '@gobletqa/workflows/types'

import type {
  TGitTag,
  TGitTagOpts,
  TTagCatOpts,
  TTagListOpts,
  TGitFetchOpts,
  TTagRemoveOpts,
  TTagPushOpts
} from './gitcmd.types'

import { git } from './gitCmd'
import { deepMerge, isStr } from '@keg-hub/jsutils'
import { GitRemoteRef } from '@gobletqa/workflows/constants'
import {
  defCmdOpts,
  hasGitError,
  buildFetchOpts,
  validateGitOpts,
  generateRemoteUrl,
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

// git cat-file blob goblet-do-not-delete
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

  return hasGitError(tagErr, tagResp, `tag.list`)
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
  const { log } = gitOpts
  const [tagErr, tagResp] = await tagCat(gitOpts, cmdOpts)

  return hasGitError(tagErr, tagResp, `cat-file`, log)
    ? undefined
    : tagResp?.data?.trim()
}

/**
 * Fetch all tags for a repo
 */
git.tag.fetch = async (
  fetchOpts:TGitFetchOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const { origin, auth } = fetchOpts
  const { gitArgs, gitOpts } = buildFetchOpts({
    force: true,
    prune: true,
    update: true,
    pruneTags: true,
    ...fetchOpts,
    all: true,
    tags: true,
  })

  const options = validateGitOpts(gitOpts)
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)
  const gitUrl = generateRemoteUrl(options)

  let err:Error
  let resp:TCmdResp
  try {
    // Update the git remote to include the url with the token
    auth &&
      await git([
        `remote`,
        `set-url`,
        origin || GitRemoteRef,
        gitUrl
      ], joinedOpts, options.local)

    const gitRes = await git([`fetch`, ...gitArgs], joinedOpts, options.local)
    err = gitRes[0]
    resp = gitRes[1]

    const errMsg = err?.message || resp?.error
    if(errMsg) throw new Error(errMsg)

  }
  catch(error){
    hasGitError(err, resp, `tag.fetech`)
  }
  finally {
    // Switch the remotes back after fetching the tags
    auth &&
      await git([
        `remote`,
        `set-url`,
        origin || GitRemoteRef,
        options.remote
      ], joinedOpts, options.local)
    
  }

  return [err, resp]

}


git.tag.push = async (
  gitOpts:TTagPushOpts,
  cmdOpts?:TRunCmdOpts
) => {

  const { tag } = gitOpts
  const options = validateGitOpts(gitOpts)
  const { local } = options
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)
  const gitUrl = generateRemoteUrl(options)

  const [err, resp] = await git([`push`, gitUrl, tag], joinedOpts, local)

  return hasGitError(err, resp, `tag.push`)
    ? false
    : true
}