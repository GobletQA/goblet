import type { TRepoState } from './reducer.types'
import type {
  TRepoMeta,
  TFileTree,
  TFileModel,
  TRouteMeta,
  TProxyRoute,
  TFeatureFileModelList,
  TDefinitionsAstTypeMap,
  TDefinitionFileModelList,
} from './shared.types'

export type TStatusRoutes = Record<string, TProxyRoute>

export type TValidateResp = {
  id:string
  jwt: string
  refresh: string
  username:string
  provider:string
  status: TRouteMeta
  error?: string
}

export type TRepoStatus = {
  mode: string
  routes: TStatusRoutes
  [Key: string]: any
}

export type TApiRepoResp = {
  repo: TRepoState,
  fileTree: TFileTree,
  status?: TRepoStatus
  features: TFeatureFileModelList,
  definitions: TDefinitionFileModelList,
  definitionTypes: TDefinitionsAstTypeMap
}

export type TAPIReposResp = {
  repos: TRepoMeta[]
}

export type TApiDefinitionsResp = {
  definitions: TDefinitionFileModelList,
  definitionTypes: TDefinitionsAstTypeMap
}

export type TFileResp = Record<"file", TFileModel>


export type TApiRepoReq = Record<string, any>

export type TApiConnectReq = {
  branch:string
  repoUrl:string
  newBranch:string
  branchFrom:boolean
}