import type { GraphCache } from '../repo/getUserRepos'
import type { TRepoUserRepos }  from './shared.types'

// ----- Graph API ----- //

export type TGCacheOpts = {
  url?: string
  token: string
}

export type TGraphApiEndpoint = {
  QUERY:string
  KEY: string
  DATA_PATH: string
}

export type TGraphApiVars = TRepoUserRepos & {
  graphCache?:GraphCache
  endpoint: TGraphApiEndpoint
}

export type TGraphPageInfo = {
  hasNextPage: boolean
  endCursor: string|number
}

export type TGraphApiResp = {
  nodes: any[]
  totalCount: number
  pageInfo: TGraphPageInfo
}


export type TSaveMetaData = {
  message?: string
  [key: string]: any
}

export type TRepoMeta = {
  url: string
  name:string
  branches:string[]
}


export type TCreateRepo = {
  name:string
  branch:string
  provider:string
  newBranch?:string
  branchFrom?:boolean
  description?:string
}