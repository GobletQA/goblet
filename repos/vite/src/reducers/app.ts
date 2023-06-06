import type { TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { EAppStatus, EEditorType } from '@types'
import { getQueryData } from '@utils/url/getQueryData'
import { updateUrlQuery } from '@utils/url/updateUrlQuery'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TAppState = {
  editor:EEditorType
  status:EAppStatus
  sidebarLocked: boolean
  multiFeatsErr: boolean
}

const editor = getQueryData()?.editor
  || EEditorType.visual
  || EEditorType.code

updateUrlQuery({ editor }, true)

export const appState = {
  editor,
  sidebarLocked: false,
  multiFeatsErr: false,
  status:EAppStatus.Active,
} as TAppState

const clearApp = createAction<TAppState>(`clearApp`)
const setApp = createAction<TAppState>(`setApp`)
const setStatus = createAction<EAppStatus>(`setStatus`)
const setEditor = createAction<EEditorType>(`setEditor`)
const toggleSidebarLocked = createAction<boolean>(`toggleSidebarLocked`)
const toggleMultiFeatsErr = createAction<boolean>(`toggleMultiFeatsErr`)

export const appActions = {
  clearApp: (state:TAppState, action:TDspAction<TAppState>) => (appState),
  setApp: (state:TAppState, action:TDspAction<TAppState>) => action?.payload,
  setEditor: (state:TAppState, action:TDspAction<EEditorType>) => ({
    ...state,
    editor: action?.payload,
  }),
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

export const appReducer = createReducer(appState, (builder:ActionReducerMapBuilder<TAppState>) => {
  builder.addCase(clearApp, appActions.clearApp)
  builder.addCase(setApp, appActions.setApp)
  builder.addCase(setStatus, appActions.setStatus)
  builder.addCase(setEditor, appActions.setEditor)
  builder.addCase(toggleSidebarLocked, appActions.toggleSidebarLocked)
  builder.addCase(toggleMultiFeatsErr, appActions.toggleMultiFeatsErr)
})



