import type { TRepoState } from '@reducers'
import type {
  TRepo,
  TFileTree,
  TProxyRoute,
  TDefinitionsAstList,
  TFeatureFileModelList,
  TDefinitionsAstTypeMap
} from './shared.types'

export type TStatusRoutes = Record<string, TProxyRoute>

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
