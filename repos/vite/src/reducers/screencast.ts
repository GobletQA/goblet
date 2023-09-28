import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type {
  TDspAction,
  TBrowserOpts,
  TScreencastStatus,
  TRecordingActions,
  TRecordingBrowser,
} from '@types'

import { deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'


export type TScreencastState = {
  browserOpts: TBrowserOpts
  screencastStatus: TScreencastStatus
  recordingBrowser: TRecordingBrowser
  recordingActions: TRecordingActions
}

export const screencastState = {} as TScreencastState

const setScreencast = createAction<TScreencastState>(`setScreencast`)
const clearScreencast = createAction<TScreencastState>(`clearScreencast`)
const upsertScreencast = createAction<TScreencastState>(`upsertScreencast`)

const actions = {
  clearScreencast: (state:TScreencastState, action:TDspAction<TScreencastState>) => (screencastState),
  setScreencast: (state:TScreencastState, action:TDspAction<TScreencastState>) => action?.payload,
  upsertScreencast: (state:TScreencastState, action:TDspAction<TScreencastState>) => deepMerge<TScreencastState>(state, action?.payload),
}

export const screencastReducer = createReducer(
  deepMerge(screencastState),
  (builder:ActionReducerMapBuilder<TScreencastState>) => {
    builder.addCase(setScreencast, actions.setScreencast)
    builder.addCase(clearScreencast, actions.clearScreencast)
    builder.addCase(upsertScreencast, actions.upsertScreencast)
  }
)
