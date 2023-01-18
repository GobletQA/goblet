import type { TGitData, TDspAction, TFileTypes } from '@types'
import { deepMerge } from '@keg-hub/jsutils'

export type TWorld = {
  [key:string]: any
}

export type TRepoState = {
  name: string
  world: TWorld
  git: TGitData
  environment: string
  fileTypes: TFileTypes
  paths: Record<string, string>
}

export const repoState = {} as TRepoState

export const repoActions = {
  clearRepo: (state:TRepoState, action:TDspAction<TRepoState>) => (repoState),
  setRepo: (state:TRepoState, action:TDspAction<TRepoState>) => action?.payload,
  upsertRepo: (state:TRepoState, action:TDspAction<TRepoState>) => deepMerge<TRepoState>(state, action?.payload),
}

