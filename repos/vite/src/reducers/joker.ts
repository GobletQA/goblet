import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type {
  TDspAction,
  TJokerMessage,
  TJokerMessageId,
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
const upsertJkrMessage = createAction<TJokerMessage>(`upsertJkrMessage`)
const toggleJokerRunning = createAction<boolean|undefined>(`toggleJokerRunning`)

export const jokerActions = {
  clearJkrMessages: (state:TJokerState, action:TDspAction<any>) => (jokerState),
  upsertJkrMessage: (state:TJokerState, action:TDspAction<TJokerMessage>) => {
    const data = action.payload
    if(!data || !data?.id) return state

    const messages = [...state.messages]
    const mIdx = messages.findIndex((msg) => msg.id === data.id)
    mIdx >= 0 ? (messages[mIdx] = deepMerge(messages[mIdx], data)) : messages.push(data)

    return {...state, messages}
  },

  removeJkrMessage: (state:TJokerState, action:TDspAction<TJokerMessageId>) => {
    const id = action.payload

    return !id
      ? state
      : {
          ...state,
          messages: [...state.messages].filter((msg) => msg.id !== id)
        }
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

