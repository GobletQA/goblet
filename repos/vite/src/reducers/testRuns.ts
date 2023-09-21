import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type {
  TTestRunId,
  TTestRun,
  TTestRuns,
  TDspAction,
  TAddTestRun,
  TTestRunEvent,
  TAddTestRunEvts,
  TAddActiveTestRunEvts,
} from '@types'

import { createReducer, createAction } from '@reduxjs/toolkit'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'


export type TTestRunsState = {
  runs: TTestRuns
  active?:string
}

export const testRunsState = {
  runs: {},
} as TTestRunsState

const addTestRun = createAction<TAddTestRun>(`addTestRun`)
const clearTestRuns = createAction<TTestRunsState>(`clearTestRuns`)
const removeTestRun = createAction<TTestRunId>(`removeTestRun`)

const setTestRunActive = createAction<TTestRunId>(`setTestRunActive`)
const addActiveTestRunEvt = createAction<TAddActiveTestRunEvts>(`addActiveTestRunEvt`)
const addEvtAndMakeActive = createAction<TAddTestRunEvts>(`addEvtAndMakeActive`)


const getEvents = (opts:TAddActiveTestRunEvts) => {
  const { events=[], event } = opts
  return !event || events.find(evt => evt?.timestamp ===  event?.timestamp)
    ? events
    : [...events, event]
}


export const testRunsActions = {
  clearTestRuns: (state:TTestRunsState, action:TDspAction<TTestRunsState>) => (testRunsState),

  addTestRun: (state:TTestRunsState, action:TDspAction<TAddTestRun>) => {
    const { runId, data={} } = action?.payload

    return {
      ...state,
      runs: {...state.runs, [runId]: data}
    }
  },

  setTestRunActive: (state:TTestRunsState, action:TDspAction<TTestRunId>) => {
    const runId = action?.payload
    if(state?.active === runId) return state

    const testRun = state.runs?.[runId] || {}

    return {
      ...state,
      active: runId,
      runs: {...state.runs, [runId]: testRun }
    } as TTestRunsState
  },

  removeTestRun: (state:TTestRunsState, action:TDspAction<TTestRunId>) => {
    const runId = action?.payload
    const copy = {...state}

    if(copy.runs[runId]) delete copy.runs[runId]
    if(state?.active === runId) delete copy.active

    return copy
  },

  addActiveTestRunEvt: (state:TTestRunsState, action:TDspAction<TAddActiveTestRunEvts>) => {
    if(!state.active){
      console.warn(`Can not add run events; missing active Test Run ID`)
      return state
    }

    const runId = state.active
    const events = getEvents(action?.payload)
    const testRun = addEventsToTestRun({...state.runs[runId]}, events)

    return {...state, runs: {...state.runs, [runId]: testRun }}
  },

  addTestRunEvt: (state:TTestRunsState, action:TDspAction<TAddTestRunEvts>) => {
    const { runId } = action?.payload
    if(!runId){
      console.warn(`A runId is required to add events to a test run`)
      return state
    }
    
    const events = getEvents(action?.payload)
    const testRun = addEventsToTestRun({...state.runs[runId]}, events)

    return {...state, runs: {...state.runs, [runId]: testRun }}
  },

  addEvtAndMakeActive: (state:TTestRunsState, action:TDspAction<TAddTestRunEvts>) => {
    const { runId } = action?.payload
    if(!runId){
      console.warn(`A runId is required to make a testRun active and add events to it`)
      return state
    }

    const events = getEvents(action?.payload)
    const testRun = addEventsToTestRun({...state.runs[runId]}, events)

    return {
      ...state,
      active: runId,
      runs: {...state.runs, [runId]: testRun }
    }
  },



}

export const testRunsReducer = createReducer(testRunsState, (builder:ActionReducerMapBuilder<TTestRunsState>) => {
  builder.addCase(addTestRun, testRunsActions.addTestRun)
  builder.addCase(clearTestRuns, testRunsActions.clearTestRuns)
  builder.addCase(removeTestRun, testRunsActions.removeTestRun)
  builder.addCase(setTestRunActive, testRunsActions.setTestRunActive)
  builder.addCase(addActiveTestRunEvt, testRunsActions.addActiveTestRunEvt)
  builder.addCase(addEvtAndMakeActive, testRunsActions.addEvtAndMakeActive)
})

