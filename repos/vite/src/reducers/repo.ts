import type { TAction } from '@reducers'
import { deepMerge } from '@keg-hub/jsutils'
import { createDispatcher } from '@utils/dispatcher'

export type TWorld = {
  [key:string]: any
}

export type TRepoState = {
  name: string
  url: string
  world: TWorld
  git: Record<string, any>
  paths: Record<string, string>
  [key:string]: any
}

export const repoState = {} as TRepoState

export const repoActions = {
  clear: (state:TRepoState, action:TAction<TRepoState>) => (repoState),
  setRepo: (state:TRepoState, action:TAction<TRepoState>) => action?.payload,
  upsertRepo: (state:TRepoState, action:TAction<TRepoState>) => deepMerge<TRepoState>(state, action?.payload),
}

export const repoDispatch = createDispatcher(repoActions)
