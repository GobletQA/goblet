import type { TRepoState, TFilesState } from './reducer.types'

export type THEditorFiles = {
  repo: TRepoState
  rootPrefix: string
  repoFiles: TFilesState
}
