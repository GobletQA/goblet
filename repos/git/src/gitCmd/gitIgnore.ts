import type {
  TGitIgnore,
  TGitIgnoreOpts,
  TGitIgnoreTrackOpts
} from './gitcmd.types'
import type {
  TRunCmdOpts,
  TLimboCmdResp
} from '@GGT/types'

import path from 'path'
import { promises } from 'fs'
import { git } from './gitCmd'
import { ENVS } from '@gobletqa/environment'
import { limbo } from '@keg-hub/jsutils/limbo'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import {
  defCmdOpts,
  hasGitError
} from './gitHelpers'

const { access, writeFile } = promises

const globalIgnore = `
goblet/**/**secrets**.env
goblet/**/**values**.env
`

const buildUnchangedArgs = (options:TGitIgnoreTrackOpts,) => {
  const { track, location } = options
  return [
    `update-index`,
    track ? `--no-assume-unchanged` : `--assume-unchanged`,
    location
  ]
}

const gitUnchanged = async (
  options:TGitIgnoreTrackOpts,
  cmdOpts?:TRunCmdOpts
):Promise<TLimboCmdResp> => {

  const { local } = options
  const gitArgs = buildUnchangedArgs(options)

  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)
  return await git(gitArgs, joinedOpts, local)
}

const checkGlobalIgnore = async () => {
  const [err, resp] = await limbo(access(ENVS.GB_GIT_GLOBAL_IGNORE))
  const pathExists =  err ? false : !Boolean(err)

  if(!pathExists)
    await limbo(writeFile(ENVS.GB_GIT_GLOBAL_IGNORE, globalIgnore))

  return true
}

const setGlobalIgnoreCfg = async (
  opts:TGitIgnoreOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const joinedOpts = deepMerge(defCmdOpts, cmdOpts)
  const [cfgErr, cfgResp] = await git([
    `config`,
    `--global`,
    `core.excludesFile`,
    `/goblet/.gitignore`
  ],
    joinedOpts,
    opts.local
  )

  return hasGitError(cfgErr, cfgResp, `core.excludesFile`)
    ? undefined
    : true
}

const setLocalExclude = async (
  opts:TGitIgnoreOpts,
  cmdOpts?:TRunCmdOpts
) => {
  const excludeLoc = path.join(opts.local, `.git/info/exclude`)
  return await limbo(writeFile(excludeLoc, globalIgnore)) as TLimboCmdResp
}

git.ignore = (async (opts:TGitIgnoreOpts, cmdOpts?:TRunCmdOpts) => {

  return [undefined, undefined]
}) as TGitIgnore


git.ignore.track = async (
  opts:Omit<TGitIgnoreTrackOpts, `track`>,
  cmdOpts?:TRunCmdOpts
) => {
  const [err, resp] = await gitUnchanged({...opts, track: true }, cmdOpts)
  return (err || resp.error) ? false : true
}

git.ignore.untrack = async (
  opts:Omit<TGitIgnoreTrackOpts, `track`>,
  cmdOpts?:TRunCmdOpts
) => {
  const [err, resp] = await gitUnchanged({...opts, track: false }, cmdOpts)
  return (err || resp.error) ? false : true
}

git.ignore.global = async (
  opts:TGitIgnoreOpts,
  cmdOpts?:TRunCmdOpts
) => {

  const hasGlobal = await checkGlobalIgnore()
  if(!hasGlobal) return [new Error(`Error setting up global git ignore`), undefined]

  const cfgSet = await setGlobalIgnoreCfg(opts, cmdOpts)
  if(!cfgSet) return [new Error(`Error setting global git ignore config`), undefined]

  return await setLocalExclude(opts, cmdOpts)
}

git.ignore.exclude = async (
  opts:TGitIgnoreOpts,
  cmdOpts?:TRunCmdOpts
) => {
  return await setLocalExclude(opts, cmdOpts)
}


