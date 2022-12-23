import type { TAction } from '@types'
import { EEditorType } from '@types'


export type TAppState = {
  editor:EEditorType
}

export const appState = {
  editor: EEditorType.visual
} as TAppState

export const appActions = {
  clearApp: (state:TAppState, action:TAction<TAppState>) => (appState),
  setApp: (state:TAppState, action:TAction<TAppState>) => action?.payload,
  setEditor: (state:TAppState, action:TAction<EEditorType>) => ({
    ...state,
    editor: action?.payload,
  }),
}
