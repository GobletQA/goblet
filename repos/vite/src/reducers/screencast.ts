import type {
  TDspAction,
  TBrowserOpts,
  TScreencastStatus,
  TRecordingActions,
  TRecordingBrowser,
} from '@types'
import { deepMerge } from '@keg-hub/jsutils'
import { createDispatcher } from '@utils/dispatcher'


export type TScreencastState = {
  browserOpts: TBrowserOpts
  screencastStatus: TScreencastStatus
  recordingBrowser: TRecordingBrowser
  recordingActions: TRecordingActions
}

export const screencastState = {} as TScreencastState

export const screencastActions = {
  clearScreencast: (state:TScreencastState, action:TDspAction<TScreencastState>) => (screencastState),
  setScreencast: (state:TScreencastState, action:TDspAction<TScreencastState>) => action?.payload,
  upsertScreencast: (state:TScreencastState, action:TDspAction<TScreencastState>) => deepMerge<TScreencastState>(state, action?.payload),
}

export const screencastDispatch = createDispatcher(screencastActions)
