import type { TPlayerResEvent, TTestRuns, TAddTestRunEvt, TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { createReducer, createAction } from '@reduxjs/toolkit'

export type TTestRunsState = {
  runs: TTestRuns
  active?:string
}

export type TAddEventToTestRun = {
  name:string
  event?:TPlayerResEvent
  events?:TPlayerResEvent[]
}

export const testRunsState = {
  runs: {},
} as TTestRunsState

const addTestRun = createAction<TAddTestRunEvt>(`addTestRun`)
const removeTestRun = createAction<string>(`removeTestRun`)
const setTestRunActive = createAction<string>(`setTestRunActive`)
const clearTestRuns = createAction<TTestRunsState>(`clearTestRuns`)
const addActiveTestRunEvt = createAction<TPlayerResEvent>(`addActiveTestRunEvt`)
const addEvtAndMakeActive = createAction<TAddEventToTestRun>(`addEvtAndMakeActive`)

const sortEvents = (events:TPlayerResEvent[]) => events.sort((a, b) => {
  const aTime = a?.data?.timestamp || 0
  const bTime = b?.data?.timestamp || 0
  return aTime > bTime ? 1 : bTime > aTime ? -1 : 0
})

export const testRunsActions = {
  clearTestRuns: (state:TTestRunsState, action:TDspAction<TTestRunsState>) => (testRunsState),

  addTestRun: (state:TTestRunsState, action:TDspAction<TAddTestRunEvt>) => {
    const { name, events=[], event } = action?.payload
    event
      && !events.find(evt => evt?.data?.timestamp ===  event?.data?.timestamp)
      && events.push(event)

    return {
      ...state,
      runs: {...state.runs, [name]: sortEvents(events)}
    }
  },

  setTestRunActive: (state:TTestRunsState, action:TDspAction<string>) => {
    const name = action?.payload
    if(state?.active === name) return state

    const events = state.runs?.[name] || []

    return {
      ...state,
      active: name,
      runs: {...state.runs, [name]: events }
    } as TTestRunsState
  },

  addActiveTestRunEvt: (state:TTestRunsState, action:TDspAction<TPlayerResEvent>) => {
    const event  = action?.payload
    const active = state.active
    return active
      ? {
          ...state,
          runs: {
            ...state.runs,
            [active]: sortEvents([...state.runs[active], event])
          },
        }
      : state
  },

  addTestRunEvt: (state:TTestRunsState, action:TDspAction<TAddEventToTestRun>) => {
    const { name, events=[], event } = action?.payload
    event
      && !events.find(evt => evt?.data?.timestamp ===  event?.data?.timestamp)
      && events.push(event)

    return {
      ...state,
      runs: {
        ...state.runs,
        [name]: sortEvents([...state.runs[name], ...events])
      },
    }
  },

  addEvtAndMakeActive: (state:TTestRunsState, action:TDspAction<TAddEventToTestRun>) => {
    const { name, events=[], event } = action?.payload
    event
      && !events.find(evt => evt?.data?.timestamp ===  event?.data?.timestamp)
      && events.push(event)

    const active = state?.active === name ? state?.active : name

    return {
      ...state,
      active,
      runs: {
        ...state.runs,
        [name]: sortEvents([...state.runs[name], ...events])
      },
    }
  },

  removeTestRun: (state:TTestRunsState, action:TDspAction<string>) => {
    const name = action?.payload
    const copy = {...state}

    if(copy.runs[name]) delete copy.runs[name]
    if(state?.active === name) delete copy.active

    return copy
  }

}

export const testRunsReducer = createReducer(testRunsState, (builder:ActionReducerMapBuilder<TTestRunsState>) => {
  builder.addCase(addTestRun, testRunsActions.addTestRun)
  builder.addCase(clearTestRuns, testRunsActions.clearTestRuns)
  builder.addCase(removeTestRun, testRunsActions.removeTestRun)
  builder.addCase(setTestRunActive, testRunsActions.setTestRunActive)
  builder.addCase(addActiveTestRunEvt, testRunsActions.addActiveTestRunEvt)
  builder.addCase(addEvtAndMakeActive, testRunsActions.addEvtAndMakeActive)
})

