import type { TFileTree, TDspAction, TFileModel } from '@types'

import { exists, deepMerge } from '@keg-hub/jsutils'

type TRenameFile = {
  oldLoc:string,
  newLoc:string,
  file:Partial<TFileModel>
  merge?:boolean
}

export type TFilesState = {
  files: TFileTree
  activeFile?: string
}

export const filesState = {
  files: {},
} as TFilesState

export const filesActions = {
  clearFiles: (state:TFilesState, action:TDspAction<TFilesState>) => (filesState),
  setActiveFile: (
    state:TFilesState,
    action:TDspAction<string>
  ) => {
    return {
      ...state,
      activeFile: action?.payload,
    }
  },
  clearActiveFile: (
    state:TFilesState,
    action:TDspAction<TFileModel>
  ) => {
    return {
      ...state,
      activeFile: undefined,
    }
  },
  setFile: (
    state:TFilesState,
    action:TDspAction<TFileModel>
  ) => {
    return {
      ...state,
      files: {
        ...state.files,
        [action.payload.uuid]: action.payload
      },
    }
  },
  removeFile: (
    state:TFilesState,
    action:TDspAction<string>
  ) => {
    if(state.files[action.payload])
      delete state.files[action.payload]

    if(state?.activeFile === action.payload)
      state.activeFile = undefined
  },
  upsertFile: (
    state:TFilesState,
    action:TDspAction<TFileModel>
  ) => {
    return {
      ...state,
      files: {
        ...state.files,
        [action.payload.uuid]: deepMerge(state.files[action.payload.uuid], action.payload)
      },
    }
  },
  renameFile: (
    state:TFilesState,
    action:TDspAction<TRenameFile>
  ) => {
    const { oldLoc, newLoc, file, merge=true } = action.payload
    const model = state.files[oldLoc]
    const updated = merge ? deepMerge<TFileModel>(model, file) : file as TFileModel

    state.files[newLoc] = updated
    delete state.files[oldLoc]

    if(state?.activeFile === oldLoc)
      state.activeFile = newLoc

  },
  setFiles: (
    state:TFilesState,
    action:TDspAction<TFileTree>
  ) => {
    return {
      ...state,
      files: action?.payload,
    }
  },
  upsertFiles: (
    state:TFilesState,
    action:TDspAction<TFileTree>
  ) => {
    return {
      ...state,
      files: {
        ...state.files,
        ...Object.entries(action?.payload).reduce((acc, [key, model]) => {
          acc[key] = exists(state.files[key])
            ? deepMerge(state.files[key], model)
            : model

          return acc
        }, {} as TFileTree)
      }
    }
  },
}
