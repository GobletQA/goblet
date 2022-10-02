import { createReducer } from '@reduxjs/toolkit'
import { CombinedState, combineReducers } from 'redux'

import {
  TContainerState,
  containerState,
  containerActions
} from './container'

import {
  TDefinitionsState,
  definitionsState,
  definitionsActions
} from './definitions'

import {
  TFeaturesState,
  featuresState,
  featuresActions
} from './features'

import {
  TFilesState,
  filesState,
  filesActions
} from './files'

import {
  TFileTreeState,
  fileTreeState,
  fileTreeActions
} from './fileTree'

import {
  TModalState,
  modalState,
  modalActions
} from './modal'

import {
  TRepoState,
  repoState,
  repoActions
} from './repo'

import {
  TReposState,
  reposState,
  reposActions
} from './repos'

import {
  TUserState,
  userState,
  userActions
} from './user'

export type {
  TDefinitionsState,
  TFeaturesState,
  TRepoState,
  TReposState,
  TUserState
}

export type TCombinedState = {
  container: TContainerState
  definitions: TDefinitionsState
  features: TFeaturesState
  files: TFilesState
  fileTree: TFileTreeState
  modal: TModalState
  repo: TRepoState
  repos: TReposState
  user: TUserState
}
export type TState = CombinedState<TCombinedState>
export type TStateKey = keyof TState

export const preloadedState = {
  container: containerState,
  definitions: definitionsState,
  features: featuresState,
  files: filesState,
  fileTree: fileTreeState,
  modal: modalState,
  repo: repoState,
  user: userState,
}

export const reducer = combineReducers<TState>({
  container: createReducer(containerState, containerActions),
  definitions: createReducer(definitionsState, definitionsActions),
  features: createReducer(featuresState, featuresActions),
  files: createReducer(filesState, filesActions),
  fileTree: createReducer(fileTreeState, fileTreeActions),
  modal: createReducer(modalState, modalActions),
  repo: createReducer(repoState, repoActions),
  repos: createReducer(reposState, reposActions),
  user: createReducer(userState, userActions)
})
