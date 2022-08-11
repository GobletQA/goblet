import type { GraphCache } from '../repo/githubAPI'

export type TGCacheOpts = {
  url?: string
  token: string
}

export type TGraphApiEndpoint = {
  QUERY:string
  KEY: string
  DATA_PATH: string
}

export type TGraphApiVars = {
  first: number
  after: string
  token: string
  graphCache:GraphCache
  sortDirection: string
  affiliations?: string[]
  endpoint: TGraphApiEndpoint
  ownerAffiliations?: string[]
  headers: Record<string, string>
}

export type TGraphPageInfo = {
  hasNextPage: boolean
  endCursor: string|number
}

export type TGraphApiResp = {
  nodes: any[],
  pageInfo: TGraphPageInfo
}


export type TSaveMetaData = {
  message?: string
  [key: string]: any
}
