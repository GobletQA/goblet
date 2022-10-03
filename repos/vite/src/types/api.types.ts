import type { TRepoState } from '@reducers'
import type {
  TRepo,
  TFileTree,
  TRouteMeta,
  TProxyRoute,
  TDefinitionsAstList,
  TFeatureFileModelList,
  TDefinitionsAstTypeMap
} from './shared.types'

export type TStatusRoutes = Record<string, TProxyRoute>

export type TValidateResp = {
  id:string
  jwt: string
  refresh: string
  username:string
  provider:string
  status: TRouteMeta
  // These don't actually exist on this response
  // But they are referenced. Should fix
  error?: any
  repos?: TRepo[]
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
  definitions: TDefinitionsAstList,
  definitionTypes: TDefinitionsAstTypeMap
}

export type TAPIReposResp = {
  repos: TRepo[]
}

export type TApiDefinitionsResp = {
  definitions: TDefinitionsAstList,
  definitionTypes: TDefinitionsAstTypeMap
}
