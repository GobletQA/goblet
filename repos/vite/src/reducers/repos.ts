import type { TAction, TRepoMeta } from '@types'

import { deepMerge } from '@keg-hub/jsutils'
// import reposJson from './repos.test.json'

export type TReposState = TRepoMeta[]

export const reposState = {} as TReposState

export const reposActions = {
  clearRepos: (state:TReposState, action:TAction<TReposState>) => (reposState),
  setRepos: (state:TReposState, action:TAction<TReposState>) => action?.payload,
  upsertRepos: (state:TReposState, action:TAction<TReposState>) => deepMerge<TReposState>(state, action?.payload),
}
