import type { TAction, TRepo } from '@types'

import { deepMerge } from '@keg-hub/jsutils'
import reposJson from './repos.test.json'

export type TReposState = TRepo[]

export const reposState = reposJson as TReposState

export const reposActions = {
  clear: (state:TReposState, action:TAction<TReposState>) => (reposState),
  setRepos: (state:TReposState, action:TAction<TReposState>) => action?.payload,
  upsertRepos: (state:TReposState, action:TAction<TReposState>) => deepMerge<TReposState>(state, action?.payload),
}
