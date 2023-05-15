import type { TRepoState } from './reducer.types'
import type { TStepDefs } from '@ltipton/parkin'
import type { TCreateRepo, TConnectRepo } from './repo.types'
import type {
  TRepoMeta,
  TFileTree,
  TFileModel,
  TRouteMeta,
  TProxyRoute,
  TFeatureFileModelList,
  TDefinitionFileModelList,
} from './shared.types'

export type TStatusRoutes = Record<string, TProxyRoute>

export type TValidateResp = {
  id:string
  jwt: string
  error?: string
  refresh: string
  username:string
  provider:string
  status: TRouteMeta
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
  definitionTypes: TStepDefs
  features: TFeatureFileModelList,
  definitions: TDefinitionFileModelList,
}

export type TAPIReposResp = {
  repos: TRepoMeta[]
}

export type TApiDefinitionsResp = {
  definitionTypes: TStepDefs
  definitions: TDefinitionFileModelList,
}

export type TFileResp = Record<"file", TFileModel>


export type TApiRepoReq = Record<string, any>

export type TApiConnectReq = Omit<TConnectRepo, `repo`|`newRepo`|`description`> & {
  repoUrl:string
}

export type TApiCreateReq = Omit<TCreateRepo, `repo`|`newRepo`> & {
  name: string
}