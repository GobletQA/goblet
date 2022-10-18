import type {
  TAction,
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
  clear: (state:TScreencastState, action:TAction<TScreencastState>) => (screencastState),
  setScreencast: (state:TScreencastState, action:TAction<TScreencastState>) => action?.payload,
  upsertScreencast: (state:TScreencastState, action:TAction<TScreencastState>) => deepMerge<TScreencastState>(state, action?.payload),
}

export const screencastDispatch = createDispatcher(screencastActions)
