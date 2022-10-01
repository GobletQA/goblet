import type { TAction } from '@reducers'
import type { TFileModel } from '@types'
import { createDispatcher } from '@utils/dispatcher'

type TPendingFiles = Record<string, string>

export type TFilesState = {
  activeFile?: TFileModel
  files: TFileModel[]
  pendingFiles: TPendingFiles
}
export const filesState = {} as TFilesState

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
      activeFile: {},
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
      files: state.files.reduce((acc, file) => {
        file.uuid === action.payload.uuid
          ? acc.push(action.payload)
          : acc.push(file)

        return acc
      }, [] as TFileModel[]),
    }
  },
  setFiles: (
    state:TFilesState,
    action:TAction<TFileModel[]>
  ) => {
    return {
      ...state,
      files: action?.payload,
    }
  },
  setPending: (
    state:TFilesState,
    action:TAction<TPendingFiles>
  ) => {
    return {
      ...state,
      pendingFiles: {
        ...state.pendingFiles,
        ...action?.payload
      },
    }
  },
  removePending: (
    state:TFilesState,
    action:TAction<string>
  ) => {
    const pending = {...state.pendingFiles}
    delete pending[action?.payload]

    return { ...state, pendingFiles: pending }
  },
  clearPending: (
    state:TFilesState,
    action:TAction<string>
  ) => ({
    ...state,
    pendingFiles: {},
  }),
  upsertFiles: (
    state:TFilesState,
    action:TAction<TFileModel[]>
  ) => {
    return {
      ...state,
      files: [
        ...state.files,
        ...action?.payload
      ]
    }
  },
}

export const filesDispatch = createDispatcher(filesActions)