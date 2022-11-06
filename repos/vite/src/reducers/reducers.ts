import type { TState } from '@types'

import { combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'
import { userState, userActions } from './user'
import { repoState, repoActions } from './repo'
import { modalState, modalActions } from './modal'
import { reposState, reposActions } from './repos'
import { filesState, filesActions } from './files'
import { settingsState, settingsActions } from './settings'
import { featuresState, featuresActions } from './features'
import { fileTreeState, fileTreeActions } from './fileTree'
import { containerState, containerActions } from './container'
import { definitionsState, definitionsActions } from './definitions'

export const preloadedState = {
  container: containerState,
  definitions: definitionsState,
  features: featuresState,
  files: filesState,
  fileTree: fileTreeState,
  modal: modalState,
  repo: repoState,
  user: userState,
  settings: settingsState
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
  settings: createReducer(settingsState, settingsActions),
  user: createReducer(userState, userActions)
})
