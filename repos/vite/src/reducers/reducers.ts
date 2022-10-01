import { CombinedState, combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'

import {
  TContainerState,
  containerState,
  containerActions,
  containerDispatch
} from './container'

import {
  TDefinitionsState,
  definitionsState,
  definitionsActions,
  definitionsDispatch
} from './definitions'

import {
  TFeaturesState,
  featuresState,
  featuresActions,
  featuresDispatch
} from './features'

import {
  TFilesState,
  filesState,
  filesActions,
  filesDispatch
} from './files'

import {
  TFileTreeState,
  fileTreeState,
  fileTreeActions,
  fileTreeDispatch
} from './fileTree'

import {
  TRepoState,
  repoState,
  repoActions,
  repoDispatch
} from './repo'

import {
  TReposState,
  reposState,
  reposActions,
  reposDispatch
} from './repos'

import {
  TUserState,
  userState,
  userActions,
  userDispatch
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
  repo: repoState,
  user: userState,
}

export const reducer = combineReducers<TState>({
  container: createReducer(containerState, containerActions),
  definitions: createReducer(definitionsState, definitionsActions),
  features: createReducer(featuresState, featuresActions),
  files: createReducer(filesState, filesActions),
  fileTree: createReducer(fileTreeState, fileTreeActions),
  repo: createReducer(repoState, repoActions),
  repos: createReducer(reposState, reposActions),
  user: createReducer(userState, userActions)
})

export {
  containerDispatch,
  definitionsDispatch,
  definitionsDispatch as defsDispatch,
  featuresDispatch,
  filesDispatch,
  fileTreeDispatch,
  repoDispatch,
  reposDispatch,
  userDispatch,
}