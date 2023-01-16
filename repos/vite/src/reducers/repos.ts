import type { TDspAction, TRepoMeta } from '@types'

import reposJson from './repos.test.json'
import { deepMerge } from '@keg-hub/jsutils'


export const Environment = process.env.NODE_ENV || `local`

export type TReposState = TRepoMeta[]

// export const reposState = {} as TReposState
export const reposState = Environment === `production` ? {} : reposJson as TReposState


export const reposActions = {
  clearRepos: (state:TReposState, action:TDspAction<TReposState>) => (reposState),
  setRepos: (state:TReposState, action:TDspAction<TReposState>) => action?.payload,
  upsertRepos: (state:TReposState, action:TDspAction<TReposState>) => deepMerge<TReposState>(state, action?.payload),
}
