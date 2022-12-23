import type  { TGitData } from './shared.types'
import type { RepoWatcher } from '../git/repoWatcher'

export type TGitOpts = TGitData & {
  log?:boolean
  token: string
  email?: string
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