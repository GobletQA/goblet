import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type {
  TDspAction,
  TJokerMessage,
  TJokerMessageId,
  TUpsertJokerMessage,
} from '@types'

import { deepMerge, exists } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TJokerState = {
  messages: TJokerMessage[]
  jokerRunning: boolean|undefined
}

export const jokerState = {
  messages: [],
  jokerRunning: false,
} as TJokerState


const clearJkrMessages = createAction(`clearMessages`)
const removeJkrMessage = createAction<TJokerMessageId>(`removeMessage`)
const upsertJkrMessage = createAction<TUpsertJokerMessage>(`upsertJkrMessage`)
const toggleJokerRunning = createAction<boolean|undefined>(`toggleJokerRunning`)

export const jokerActions = {
  clearJkrMessages: (state:TJokerState, action:TDspAction<any>) => (jokerState),
  upsertJkrMessage: (state:TJokerState, action:TDspAction<TUpsertJokerMessage>) => {
    return state
  },

  removeJkrMessage: (state:TJokerState, action:TDspAction<TJokerMessageId>) => {
    return state
  },

  toggleJokerRunning: (state:TJokerState, action:TDspAction<boolean|undefined>) => {
    const jokerRunning = exists(action.payload) ? action.payload : !state.jokerRunning
    
    return {
      ...state,
      jokerRunning
    }
  },

}

export const jokerReducer = createReducer(
  deepMerge(jokerState),
  (builder:ActionReducerMapBuilder<TJokerState>) => {
    
    builder.addCase(upsertJkrMessage, jokerActions.upsertJkrMessage)
    builder.addCase(clearJkrMessages, jokerActions.clearJkrMessages)
    builder.addCase(removeJkrMessage, jokerActions.removeJkrMessage)
    builder.addCase(toggleJokerRunning, jokerActions.toggleJokerRunning)

  })

