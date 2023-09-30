import type { TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { EAppStatus, EEditorType } from '@types'
import {deepMerge, exists} from '@keg-hub/jsutils'
import { getQueryData } from '@utils/url/getQueryData'
import { updateUrlQuery } from '@utils/url/updateUrlQuery'
import { createReducer, createAction } from '@reduxjs/toolkit'


export type TAppState = {
  editor:EEditorType
  status:EAppStatus
  sidebarLocked:boolean
  multiFeatsErr:boolean
  jokerAIView:boolean|undefined
  testRunsView:boolean|undefined
}

const editor = getQueryData()?.editor
  || EEditorType.visual
  || EEditorType.code

updateUrlQuery({ editor }, true)

export const appState = {
  editor,
  jokerAIView: true,
  testRunsView: false,
  sidebarLocked: false,
  multiFeatsErr: false,
  status:EAppStatus.Active,
} as TAppState

const setApp = createAction<TAppState>(`setApp`)
const clearApp = createAction<TAppState>(`clearApp`)
const setStatus = createAction<EAppStatus>(`setStatus`)
const setEditor = createAction<EEditorType>(`setEditor`)
const toggleJokerAIView = createAction<boolean>(`toggleJokerAIView`)
const toggleSidebarLocked = createAction<boolean>(`toggleSidebarLocked`)
const toggleMultiFeatsErr = createAction<boolean>(`toggleMultiFeatsErr`)
const toggleTestRunsView = createAction<boolean|undefined>(`toggleTestRunsView`)

export const appActions = {
  clearApp: (state:TAppState, action:TDspAction<TAppState>) => (appState),
  setApp: (state:TAppState, action:TDspAction<TAppState>) => action?.payload,
  setEditor: (state:TAppState, action:TDspAction<EEditorType>) => ({
    ...state,
    editor: action?.payload,
  }),
  toggleJokerAIView: (state:TAppState, action:TDspAction<boolean|undefined>) => {
    return {
      ...state,
      jokerAIView: exists(action?.payload) ? action?.payload : !state.testRunsView
    }
  },
  toggleTestRunsView: (state:TAppState, action:TDspAction<boolean|undefined>) => {
    return {
      ...state,
      testRunsView: exists(action?.payload) ? action?.payload : !state.testRunsView
    }
  },
  toggleSidebarLocked: (state:TAppState, action:TDspAction<boolean>) => {
    return {
      ...state,
      sidebarLocked: Boolean(action?.payload)
    }
  },
  toggleMultiFeatsErr: (state:TAppState, action:TDspAction<boolean>) => {
    return {
      ...state,
      multiFeatsErr: Boolean(action?.payload)
    }
  },
  setStatus: (state:TAppState, action:TDspAction<EAppStatus>) => {
    return {
      ...state,
      status: action?.payload
    }
  }
}

export const appReducer = createReducer(
  deepMerge(appState),
  (builder:ActionReducerMapBuilder<TAppState>) => {
    builder.addCase(clearApp, appActions.clearApp)
    builder.addCase(setApp, appActions.setApp)
    builder.addCase(setStatus, appActions.setStatus)
    builder.addCase(setEditor, appActions.setEditor)
    builder.addCase(toggleJokerAIView, appActions.toggleJokerAIView)
    builder.addCase(toggleTestRunsView, appActions.toggleTestRunsView)
    builder.addCase(toggleSidebarLocked, appActions.toggleSidebarLocked)
    builder.addCase(toggleMultiFeatsErr, appActions.toggleMultiFeatsErr)
  })



