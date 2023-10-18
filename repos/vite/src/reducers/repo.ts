import type { TRepoOpts, TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TRepoState = TRepoOpts

export const repoState = {} as TRepoState

const setRepo = createAction<TRepoState>(`setRepo`)
const clearRepo = createAction<TRepoState>(`clearRepo`)
const upsertRepo = createAction<TRepoState>(`upsertRepo`)

export const repoActions = {
  clearRepo: (state:TRepoState, action:TDspAction<TRepoState>) => (repoState),
  setRepo: (state:TRepoState, action:TDspAction<TRepoState>) => action?.payload,
  upsertRepo: (state:TRepoState, action:TDspAction<TRepoState>) => deepMerge<TRepoState>(state, action?.payload),
}

export const repoReducer = createReducer(
  deepMerge(repoState),
  (builder:ActionReducerMapBuilder<TRepoState>) => {
    builder.addCase(setRepo, repoActions.setRepo)
    builder.addCase(clearRepo, repoActions.clearRepo)
    builder.addCase(upsertRepo, repoActions.upsertRepo)
  }
)
