import type {
  TCmdResp,
  TGitOpts,
  TGitMeta,
  TRunCmdOpts,
  TRepoGitState,
  TLimboCmdResp,
  TSaveMetaData,
} from '@gobletqa/workflows/types'

import type { loadToken } from './loadToken'

export type TGitHashOpts = TGitOpts & {
  log?:boolean
  path?:string
  write?:boolean
  content?:string
  location?:string
  filters?:boolean
  literally?:boolean
  type?:`blob`|`commit`|`tag`|`tree`|`commit`
}

export type TGitRemoteOpts = {
  url?:string
  origin?:string
}

export type TGitRemote = {
  (
    cmdArgs:string[],
    gitOpts:TGitOpts,
    cmdOpts?:TRunCmdOpts,
  ): Promise<TLimboCmdResp>
  add: (gitOpts:TGitOpts, opts?:TGitRemoteOpts) => Promise<boolean>
  print: (gitOpts:TGitOpts, opts?:TGitRemoteOpts, cmdOpts?:TRunCmdOpts) => Promise<string>
}


export type TGitCreateBranch = TGitOpts & {
  force?:boolean
  reset?:boolean
}

export type TGitBranch = {
  (
    cmdArgs:string[],
    gitOpts:TGitOpts,
    cmdOpts?:TRunCmdOpts,
  ): Promise<TLimboCmdResp>
  current: (gitOpts:TGitOpts, opts?:TGitRemoteOpts, cmdOpts?:TRunCmdOpts) => Promise<string>
  create: (gitOpts:TGitCreateBranch, cmdOpts?:TRunCmdOpts) => Promise<string>
}


export type TGitHash = {
  (args:TGitHashOpts, cmdOpts?:TRunCmdOpts): Promise<TLimboCmdResp>
  file: (gitOpts:TGitHashOpts, opts?:TRunCmdOpts) => Promise<string>
  content: (gitOpts:TGitHashOpts, opts?:TRunCmdOpts) => Promise<string>
  hashFile: (gitOpts:TGitHashOpts, opts?:TRunCmdOpts) => Promise<TLimboCmdResp>
  hashContent: (gitOpts:TGitHashOpts, opts?:TRunCmdOpts) => Promise<TLimboCmdResp>
}

export type TGitIgnoreOpts = {
  log?:boolean
  local:string
  location?:string
}

export type TGitIgnoreTrackOpts = TGitIgnoreOpts & {
  track?:boolean
}

export type TGitIgnore = {
  (args:TGitIgnoreOpts, cmdOpts?:TRunCmdOpts): Promise<TLimboCmdResp>
  track: (gitOpts:TGitIgnoreTrackOpts, opts?:TRunCmdOpts) => Promise<boolean>
  untrack: (gitOpts:TGitIgnoreTrackOpts, opts?:TRunCmdOpts) => Promise<boolean>
  global: (gitOpts:TGitIgnoreOpts, opts?:TRunCmdOpts) => Promise<TLimboCmdResp>
  exclude: (gitOpts:TGitIgnoreOpts, opts?:TRunCmdOpts) => Promise<TLimboCmdResp>
}

export type TGitTagOpts = TGitOpts & {
  log?:boolean
  tag:string
  ref:string
  key?:string
  sign?:boolean
  force?:boolean
  format?:string
  message?:string
  remove?:boolean
  annotate?:string
  list?:string|boolean
}

export type TTagRemoveOpts = Omit<TGitTagOpts, `ref`>
export type TTagListOpts = Omit<TGitTagOpts, `tag`|`ref`>
export type TTagCatOpts = Omit<TGitTagOpts, `ref`> & {
  log?:boolean
}

export type TTagPushOpts = Omit<TGitTagOpts, `ref`> & {
  tag:string
  origin?:string
  force?:boolean
}


export type TGitTag = {
  (args:TGitTagOpts, cmdOpts?:TRunCmdOpts): Promise<TLimboCmdResp>
  fetch:TGitFetch
  cat: (gitOpts:TTagCatOpts, opts?:TRunCmdOpts) => Promise<string>
  push:(gitOpts:TTagPushOpts, opts?:TRunCmdOpts) => Promise<boolean>
  list: (gitOpts:TTagListOpts, opts?:TRunCmdOpts) => Promise<string[]>
  remove: (gitOpts:TTagRemoveOpts, opts?:TRunCmdOpts) => Promise<TLimboCmdResp>
}

export type TGitSetUser = (gitOpts:TGitOpts, cmdOpts?:TRunCmdOpts) => Promise<TLimboCmdResp>

export type TGitCmdResp = Promise<[err:Error, resp:TCmdResp]>
export type TGitExecCmd = (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts
) => TGitCmdResp

export type TGitClone = TGitExecCmd
export type TGitPull = TGitExecCmd
export type TGitClearCache = (
  location:string,
  cmdOpts?:TRunCmdOpts
) => TGitCmdResp

export type TGitPush = (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts
) => Promise<[err:Error, resp:TCmdResp, saved:boolean]>

export type TGitCommit = (
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
  metaData?:TSaveMetaData
) => TGitCmdResp


export type TGitFetchOpts = TGitOpts & {
  all?:boolean
  tags?:boolean
  keep?:boolean
  force?:boolean
  prune?:boolean
  append?:boolean
  update?:boolean // update-shallow
  verbose?:boolean
  multiple?:boolean
  progress?:boolean
  upstream?:boolean // --set-upstream
  unshallow?:boolean
  pruneTags?:boolean // --prune-tags
  submodules?:boolean // recurse-submodules yes|on-demand|no
  depth?:number|string
  deepen?:number|string

  origin?:string // Origin to use
  auth?:boolean // Switch remotes to allow auth when fetching
}

export type TGitFetch = (
  gitOpts:TGitFetchOpts,
  cmdOpts?:TRunCmdOpts
) => TGitCmdResp

export type TGitExec = {
  (
    args:string[],
    opts:TRunCmdOpts,
    ...params:string[]
  ): Promise<TLimboCmdResp>
  cmd: (
  args:string[],
  gitOpts:TGitOpts,
  cmdOpts?:TRunCmdOpts,
  ) => Promise<TLimboCmdResp>
  pull:TGitPull
  clone:TGitClone
  branch: TGitBranch
  remote: TGitRemote
  setUser:TGitSetUser
  push:TGitPush
  commit:TGitCommit
  loadToken:typeof loadToken
  remove:(args:TGitMeta) => void
  exists:(args:TGitMeta, localPath?:string) => Promise<boolean>
  checkRepo:(gitOpts:TGitOpts) => Promise<TRepoGitState>
  tag:TGitTag
  hash:TGitHash
  ignore:TGitIgnore
  fetch:TGitFetch
  clearCache:TGitClearCache
  gc:(location:string, cmdOpts?:TRunCmdOpts) => TGitCmdResp
  merge:TGitCommit
}