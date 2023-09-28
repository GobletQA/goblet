import type { TFileTree, TDspAction, TFileModel } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { exists, deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

type TRenameFile = {
  oldLoc:string,
  newLoc:string,
  file:Partial<TFileModel>
  merge?:boolean
}

export type TFilesState = {
  files: TFileTree
}

export const filesState = {
  files: {},
} as TFilesState

const clearFiles = createAction<TFilesState>(`clearFiles`)
const setFile = createAction<TFileModel>(`setFile`)
const removeFile = createAction<string>(`removeFile`)
const upsertFile = createAction<TFileModel>(`upsertFile`)
const renameFile = createAction<TRenameFile>(`renameFile`)
const setFiles = createAction<TFileTree>(`setFiles`)
const addFiles = createAction<TFileTree>(`addFiles`)
const upsertFiles = createAction<TFileTree>(`upsertFiles`)

export const filesActions = {
  clearFiles: (state:TFilesState, action:TDspAction<TFilesState>) => (filesState),
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
  addFiles: (
    state:TFilesState,
    action:TDspAction<TFileTree>
  ) => {
    return {
      ...state,
      files: {...state.files, ...action?.payload}
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

export const filesReducer = createReducer(
  deepMerge(filesState),
  (builder:ActionReducerMapBuilder<TFilesState>) => {
    builder.addCase(clearFiles, filesActions.clearFiles)
    builder.addCase(setFile, filesActions.setFile)
    builder.addCase(removeFile, filesActions.removeFile)
    builder.addCase(upsertFile, filesActions.upsertFile)
    builder.addCase(renameFile, filesActions.renameFile)
    builder.addCase(setFiles, filesActions.setFiles)
    builder.addCase(addFiles, filesActions.addFiles)
    builder.addCase(upsertFiles, filesActions.upsertFiles)
  }
)
