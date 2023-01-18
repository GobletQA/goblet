import type { TDspAction } from '@types'
import { EEditorType } from '@types'


export type TAppState = {
  editor:EEditorType
  sidebarLocked: boolean
}

export const appState = {
  sidebarLocked: false,
  // editor: EEditorType.visual
  editor: EEditorType.code,
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
