import type { RepoWatcher } from '../git/repoWatcher'

export type TGitOpts = {
  log?:boolean
  local:string
  name?: string
  token: string
  remote:string
  email?: string
  branch?: string
  username: string
  newBranch?: string
  createBranch?: boolean
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
  local: string
  [key:string]: any
}

export type TGitMeta = {
  user?: TGitUser
  repo?: TGitRepo
}

export type TRepoConf = {
  name: string
  git: Record<string, any>
  [key:string]: any
}

export type TRepoWatchCb = (event:string, path:string, repoWatcher:RepoWatcher) => void