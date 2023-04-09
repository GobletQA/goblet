import type { TRepoOpts, TDspAction } from '@types'
import { deepMerge } from '@keg-hub/jsutils'

export type TRepoState = TRepoOpts

export const repoState = {} as TRepoState

export const repoActions = {
  clearRepo: (state:TRepoState, action:TDspAction<TRepoState>) => (repoState),
  setRepo: (state:TRepoState, action:TDspAction<TRepoState>) => action?.payload,
  upsertRepo: (state:TRepoState, action:TDspAction<TRepoState>) => deepMerge<TRepoState>(state, action?.payload),
}

