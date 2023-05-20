import type { TFileModel } from './shared.types'
import type { TRepoState, TFilesState } from './reducer.types'
import type { TRaceFeatures, TFeatureFileModel } from '@gobletqa/race'

export type THEditorFiles = {
  repo: TRepoState
  rootPrefix: string
  repoFiles: TFilesState
}

export type TBuiltRaceFeatures = {
  features: TRaceFeatures
  duplicates?: string[]
}

export type TRaceFolder = {
  path:string
  uuid: string
  isDir: boolean,
  parent: {
    uuid: string
    location: string
  }
}
export type TRaceFiles = Record<string, TFeatureFileModel|TRaceFolder>