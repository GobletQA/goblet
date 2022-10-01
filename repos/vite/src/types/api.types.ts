import type { TRepoState } from '@reducers'
import type {
  TRepo,
  TFileTree,
  TFeatureFileModel,
  TDefinitionsAstList,
  TDefinitionsAstTypeMap
} from './shared.types'

export type TApiRepoResp = {
  repo: TRepoState,
  fileTree: TFileTree,
  features: TFeatureFileModel[],
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
