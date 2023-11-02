
import type { Graph } from '../constants'


// ----- Graph API ----- //

export type TGraphProvider = typeof Graph[`Github`] | typeof Graph[`Gitlab`]

export type TGCacheOpts = {
  variables?: Record<any, any>
}

export type TGraphApiEndpoint = {
  Query:string
  Key: string
  DataPath: string
}

export type TGetData = <T>(data:any) => TGraphApiResp<T>

export type TGraphApiVars = TRepoGraphRepos & {
  getData?:TGetData
  cacheKey?:string|false
  endpoint: TGraphApiEndpoint
}

export type TGraphPageInfo = {
  hasNextPage: boolean
  endCursor: string|number
}

export type TGraphApiResp<T> = {
  nodes: T[]
  totalCount: number
  pageInfo?: TGraphPageInfo
}


export type TSaveMetaData = {
  message?: string
  [key: string]: any
}

export type TRepoMeta = {
  id:string
  url: string
  name:string
  branches:string[]
  defaultBranch?: string
}


export type TCreateRepo = {
  name:string
  branch:string
  provider:string
  newBranch?:string
  branchFrom?:boolean
  description?:string
  organization?:string
}

export type TRepoGitState = {
  repo: boolean
  branch: boolean
  mounted: boolean
}


export type TBaseGraphApi = {
  provider: TGraphProvider
  variables: Record<any, any>
}

export type TGraphApiOpts = {
  provider?: TGraphProvider
  variables?: Record<any, any>
}

export type TRepoGraphRepos = {
  all?:boolean
  token: string
  query?:string
  first?: number
  after?: string
  offset?:number
  userId?:string
  force?:boolean
  username?:string
  fullPath?:string
  provider?:string
  subdomain?:string
  searchPattern?:string
  sortDirection?: string
  affiliations?: string[]
  ownerAffiliations?: string[]
  headers?: Record<string, string>
}

export type TRepoFromWorkflow = {
  token:string
  branch:string
  repoId:string
  repoUrl:string
  username:string
  newBranch?:string
  branchFrom?:boolean
}

export type TRepoMountStatus = {
  mode?: string
  setup: boolean
  status?: string
  message?:string
  mounted?: boolean
}
