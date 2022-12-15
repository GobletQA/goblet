import type { TGitData, TAction, TFileTypes } from '@types'
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
  clearRepo: (state:TRepoState, action:TAction<TRepoState>) => (repoState),
  setRepo: (state:TRepoState, action:TAction<TRepoState>) => action?.payload,
  upsertRepo: (state:TRepoState, action:TAction<TRepoState>) => deepMerge<TRepoState>(state, action?.payload),
}

