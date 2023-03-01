import type { TDspAction } from '@types'
import { EEditorType } from '@types'
import { getQueryData } from '@utils/url/getQueryData'

export type TAppState = {
  editor:EEditorType
  sidebarLocked: boolean
}

const editor = getQueryData()?.editor || EEditorType.visual || EEditorType.code

export const appState = {
  editor,
  sidebarLocked: false,
} as TAppState

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
