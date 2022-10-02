import type { TRepo } from '@types'
import type { TAction } from '@reducers'
import { deepMerge } from '@keg-hub/jsutils'

export type TReposState = TRepo[]

export const reposState = [] as TReposState

export const reposActions = {
  clear: (state:TReposState, action:TAction<TReposState>) => (reposState),
  setRepos: (state:TReposState, action:TAction<TReposState>) => action?.payload,
  upsertRepos: (state:TReposState, action:TAction<TReposState>) => deepMerge<TReposState>(state, action?.payload),
}
