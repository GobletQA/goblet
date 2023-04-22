import type { TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { EEditorType } from '@types'
import { getQueryData } from '@utils/url/getQueryData'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TAppState = {
  editor:EEditorType
  sidebarLocked: boolean
}

const editor = getQueryData()?.editor
  || EEditorType.visual
  || EEditorType.code

export const appState = {
  editor,
  sidebarLocked: false,
} as TAppState


const clearApp = createAction<TAppState>(`clearApp`)
const setApp = createAction<TAppState>(`setApp`)
const setEditor = createAction<EEditorType>(`setEditor`)
const toggleSidebarLocked = createAction<boolean>(`toggleSidebarLocked`)

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
}

export const appReducer = createReducer(appState, (builder:ActionReducerMapBuilder<TAppState>) => {
  builder.addCase(clearApp, appActions.clearApp)
  builder.addCase(setApp, appActions.setApp)
  builder.addCase(setEditor, appActions.setEditor)
  builder.addCase(toggleSidebarLocked, appActions.toggleSidebarLocked)
})



