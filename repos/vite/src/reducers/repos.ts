import type { TDspAction, TRepoMeta } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

export const Environment = process.env.NODE_ENV || `local`

export type TReposState = TRepoMeta[]

export const reposState = [] as TReposState

const setRepos = createAction<TReposState>(`setRepos`)
const clearRepos = createAction<TReposState>(`clearRepos`)
const upsertRepos = createAction<TReposState>(`upsertRepos`)

export const reposActions = {
  clearRepos: (state:TReposState, action:TDspAction<TReposState>) => (reposState),
  setRepos: (state:TReposState, action:TDspAction<TReposState>) => action?.payload,
  upsertRepos: (state:TReposState, action:TDspAction<TReposState>) => deepMerge<TReposState>(state, action?.payload),
}

export const reposReducer = createReducer(
  reposState,
  (builder:ActionReducerMapBuilder<TReposState>) => {
    builder.addCase(setRepos, reposActions.setRepos)
    builder.addCase(clearRepos, reposActions.clearRepos)
    builder.addCase(upsertRepos, reposActions.upsertRepos)
  }
)
