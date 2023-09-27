import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import type {
  TTestRuns,
  TTestRunId,
  TDspAction,
  TAddTestRun,
  TUpsertTestRun,
  TAddTestRunEvts,
  TAddActiveTestRunEvts,
} from '@types'

import {deepMerge, exists} from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'
import { addEventsToTestRun } from '@utils/testRuns/addEventsToTestRun'


/**
 * **IMPORTANT** - Only include this for testing
 * It should not be included in production builds
 */
// import { runMock } from '@services/__mocks__/testrun.mock'

export type TTestRunsState = {
  active?:string
  runs: TTestRuns
  allTestsRunning: boolean|undefined
}

export const testRunsState = {
  // runs: runMock,
  runs: {},
  allTestsRunning: false,
} as TTestRunsState

const addTestRun = createAction<TAddTestRun>(`addTestRun`)
const removeTestRun = createAction<TTestRunId>(`removeTestRun`)
const upsertTestRun = createAction<TUpsertTestRun>(`upsertTestRun`)
const clearTestRuns = createAction<TTestRunsState>(`clearTestRuns`)

const addTestRunEvt = createAction<TAddTestRunEvts>(`addTestRunEvt`)
const setTestRunActive = createAction<TTestRunId>(`setTestRunActive`)
const cancelTestRun = createAction<TTestRunId|undefined>(`cancelTestRun`)
const toggleAllTestsRun = createAction<boolean|undefined>(`toggleAllTestsRun`)
const addEvtAndMakeActive = createAction<TAddTestRunEvts>(`addEvtAndMakeActive`)
const addActiveTestRunEvt = createAction<TAddActiveTestRunEvts>(`addActiveTestRunEvt`)

const getEvents = (opts:TAddActiveTestRunEvts) => {
  const { events=[], event } = opts
  return !event || events.find(evt => evt?.timestamp ===  event?.timestamp)
    ? events
    : [...events, event]
}


export const testRunsActions = {
  addTestRun: (state:TTestRunsState, action:TDspAction<TAddTestRun>) => {
    const { runId, data={ runId, files: {} } } = action?.payload
    return {
      ...state,
      runs: {...state.runs, [runId]: data}
    }
  },

  upsertTestRun: (state:TTestRunsState, action:TDspAction<TUpsertTestRun>) => {
    const { runId, data } = action?.payload
    return {
      ...state,
      runs: {
        ...state.runs,
        [runId]: deepMerge({ runId, files: {} }, state.runs[runId], data)
      }
    }
  },

  clearTestRuns: (state:TTestRunsState, action:TDspAction<TTestRunsState>) => (testRunsState),

  removeTestRun: (state:TTestRunsState, action:TDspAction<TTestRunId>) => {
    const runId = action?.payload
    const copy = {...state}

    if(copy.runs[runId]) delete copy.runs[runId]
    if(state?.active === runId) delete copy.active

    return copy
  },

  setTestRunActive: (state:TTestRunsState, action:TDspAction<TTestRunId>) => {
    const runId = action?.payload
    if(state?.active === runId) return state

    return {
      ...state,
      active: runId,
      runs: state.runs?.[runId]
        ? state.runs
        : {...state.runs, [runId]: {runId, files: {} }}
    } as TTestRunsState
  },

  toggleAllTestsRun: (state:TTestRunsState, action:TDspAction<boolean|undefined>) => {
    const allTestsRunning = exists(action?.payload) ? action?.payload : !state.allTestsRunning
    return {...state, allTestsRunning }
  },

  addActiveTestRunEvt: (state:TTestRunsState, action:TDspAction<TAddActiveTestRunEvts>) => {
    if(!state.active){
      console.warn(`Can not add run events; missing active Test Run ID`)
      return state
    }

    const runId = state.active
    const events = getEvents(action?.payload)
    const testRun = addEventsToTestRun({...state.runs[runId], runId }, events)

    return {...state, runs: {...state.runs, [runId]: testRun }}
  },

  addTestRunEvt: (state:TTestRunsState, action:TDspAction<TAddTestRunEvts>) => {
    const { runId } = action?.payload
    if(!runId){
      console.warn(`A runId is required to add events to a test run`)
      return state
    }
    
    const events = getEvents(action?.payload)
    const testRun = addEventsToTestRun({...state.runs[runId], runId}, events)

    return {...state, runs: {...state.runs, [runId]: testRun }}
  },

  addEvtAndMakeActive: (state:TTestRunsState, action:TDspAction<TAddTestRunEvts>) => {
    const { runId } = action?.payload
    if(!runId){
      console.warn(`A runId is required to make a testRun active and add events to it`)
      return state
    }

    const events = getEvents(action?.payload)
    const testRun = addEventsToTestRun({...state.runs[runId], runId}, events)

    return {
      ...state,
      active: runId,
      runs: {...state.runs, [runId]: testRun }
    }
  },
  
  cancelTestRun: (state:TTestRunsState, action:TDspAction<TTestRunId|undefined>) => {
    // If an id is passed validate it's the correct ID
    const runId = action?.payload
    if(runId && state?.active) return state

    // If no ID, assume we want the active test run
    const cancelId = runId || state?.active

    return !cancelId || !state?.runs?.[cancelId]
      ? state
      : {
          ...state,
          runs: {
            ...state.runs,
            [cancelId]: {
              ...state.runs[cancelId],
              canceled: true
            }
          }
        } as TTestRunsState
  }
}

export const testRunsReducer = createReducer(testRunsState, (builder:ActionReducerMapBuilder<TTestRunsState>) => {
  builder.addCase(addTestRun, testRunsActions.addTestRun)
  builder.addCase(upsertTestRun, testRunsActions.upsertTestRun)
  
  builder.addCase(clearTestRuns, testRunsActions.clearTestRuns)
  builder.addCase(removeTestRun, testRunsActions.removeTestRun)
  

  builder.addCase(addTestRunEvt, testRunsActions.addTestRunEvt)
  builder.addCase(cancelTestRun, testRunsActions.cancelTestRun)
  builder.addCase(setTestRunActive, testRunsActions.setTestRunActive)
  builder.addCase(toggleAllTestsRun, testRunsActions.toggleAllTestsRun)
  builder.addCase(addActiveTestRunEvt, testRunsActions.addActiveTestRunEvt)
  builder.addCase(addEvtAndMakeActive, testRunsActions.addEvtAndMakeActive)
})

