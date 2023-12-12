import type { RepoWatcher } from '../repoWatcher'
import type { EProvider } from './shared.types'

// TODO: fix this - is a duplicate of the type in repo/types
type TGitData = {
  name: string
  local:string
  remote:string
  branch:string
  username:string
  repoId?:string
  repoName?:string
  newBranch?:string
  provider:EProvider
  branchFrom?:boolean
}


export type TGitOpts = TGitData & {
  log?:boolean
  token: string
  email?: string
  headers?:Record<string, string>
}

export type TGitUser = {
  gitUser?: string
  username?: string
  firstName?: string
  lastName?: string
  [key:string]: any
}

export type TGitRepo = {
  url: string
  local?: string
  [key:string]: any
}

export type TGitMeta = {
  user?: TGitUser
  repo?: TGitRepo
}

export type TRepoWatchCb = (event:string, path:string, repoWatcher:RepoWatcher) => void

type TGitCreateUserRepo = {
  name: string
  homepage?:string
  private?:boolean
  has_wiki?:boolean
  has_issues?:boolean
  description?: string
  has_projects?:boolean
  allow_squash_merge?:boolean
  allow_merge_commit?:boolean
  delete_branch_on_merge?:boolean
  // Will all ways default this to true
  // auto_init?:boolean
}

export type TGitCreateOrgRepo = TGitCreateUserRepo &  {
  org: string
}

export type TGitCreateRepo = TGitCreateOrgRepo | TGitCreateUserRepo

export type TGitCreateRepoOpts = Partial<TGitCreateRepo> & {
  url:string
  name: string
  token:string
  description?: string
}
