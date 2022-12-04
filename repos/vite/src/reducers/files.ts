import type { TFileTree, TAction, TFileModel } from '@types'

import { exists, deepMerge } from '@keg-hub/jsutils'

type TRenameFile = {
  oldLoc:string,
  newLoc:string,
  file:Partial<TFileModel>
  merge?:boolean
}

export type TFilesState = {
  files: TFileTree
  activeFile?: TFileModel
}

export const filesState = {
  files: {},
} as TFilesState

export const filesActions = {
  clear: (state:TFilesState, action:TAction<TFilesState>) => (filesState),
  setActive: (
    state:TFilesState,
    action:TAction<TFileModel>
  ) => {
    return {
      ...state,
      activeFile: action?.payload,
    }
  },
  clearActive: (
    state:TFilesState,
    action:TAction<TFileModel>
  ) => {
    return {
      ...state,
      activeFile: {} as TFileModel,
    }
  },
  setFile: (
    state:TFilesState,
    action:TAction<TFileModel>
  ) => {
    return {
      ...state,
      activeFile: state?.activeFile?.uuid === action.payload.uuid
        ? action.payload
        : state?.activeFile,
      files: {
        ...state.files,
        [action.payload.uuid]: action.payload
      },
    }
  },
  removeFile: (
    state:TFilesState,
    action:TAction<string>
  ) => {
    if(state.files[action.payload])
      delete state.files[action.payload]
  },
  upsertFile: (
    state:TFilesState,
    action:TAction<TFileModel>
  ) => {
    return {
      ...state,
      activeFile: state?.activeFile?.uuid === action.payload.uuid
        ? action.payload
        : state?.activeFile,
      files: {
        ...state.files,
        [action.payload.uuid]: {
          ...state.files[action.payload.uuid],
          ...action.payload
        }
      },
    }
  },
  renameFile: (
    state:TFilesState,
    action:TAction<TRenameFile>
  ) => {
    const { oldLoc, newLoc, file, merge=true } = action.payload
    const model = state.files[oldLoc]
    state.files[newLoc] = merge ? deepMerge<TFileModel>(model, file) : file as TFileModel

    delete state.files[oldLoc]
  },
  setFiles: (
    state:TFilesState,
    action:TAction<TFileTree>
  ) => {
    return {
      ...state,
      files: action?.payload,
    }
  },
  upsertFiles: (
    state:TFilesState,
    action:TAction<TFileTree>
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
