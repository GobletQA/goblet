import type { TGLBranchMeta, TGLRepoApiMeta } from './gitlab.types'
import type { TGHBranchMeta, TGHRepoApiMeta } from './github.types'

export type TBranchMeta = TGHBranchMeta | TGLBranchMeta
export type TBranchResp = Record<`data`, TBranchMeta>
export type TBranchData = {
  sha:string
  name:string
}


export type TRepoApiMeta = TGHRepoApiMeta | TGLRepoApiMeta
export type TRepoResp = Record<`data`, TRepoApiMeta>

export type TRepoData = {
  id: number
  name: string
  url: string
  private?: boolean
  description: string
  default_branch:string
  git_url:string // gitlab - http_url_to_repo
  full_name: string // gitlab - name_with_namespace
}