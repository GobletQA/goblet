import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type { TDspAction, TContainerMeta, TProxyRoute } from '@types'

import { EContainerState } from '@types'
import { deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TContainerState = {
  api: TProxyRoute
  meta: TContainerMeta
  screencast: TProxyRoute
}

export const containerState = {} as TContainerState

const clearContainer = createAction<TContainerState>(`clearContainer`)
const setContainer = createAction<TContainerState>(`setContainer`)
const upsertContainer = createAction<TContainerState>(`upsertContainer`)
const waitingContainer = createAction<boolean>(`waitingContainer`)

export const containerActions = {
  clearContainer: (state:TContainerState, action:TDspAction<TContainerState>) => (containerState),
  setContainer: (state:TContainerState, action:TDspAction<TContainerState>) => action?.payload,
  upsertContainer: (state:TContainerState, action:TDspAction<TContainerState>) => deepMerge<TContainerState>(state, action?.payload),
  waitingContainer: (state:TContainerState, action:TDspAction<boolean>) => {
    return {...state, meta:{...state.meta, state: EContainerState.Creating}}
  }
}

export const containerReducer = createReducer(
  deepMerge(containerState),
  (builder:ActionReducerMapBuilder<TContainerState>) => {
    builder.addCase(clearContainer, containerActions.clearContainer)
    builder.addCase(setContainer, containerActions.setContainer)
    builder.addCase(upsertContainer, containerActions.upsertContainer)
    builder.addCase(waitingContainer, containerActions.waitingContainer)
    
  }
)
