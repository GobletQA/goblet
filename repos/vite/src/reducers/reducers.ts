import type { TState } from '@types'

import { combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'
import { appState, appActions } from './app'
import { userState, userActions } from './user'
import { repoState, repoActions } from './repo'
import { modalState, modalActions } from './modal'
import { reposState, reposActions } from './repos'
import { filesState, filesActions } from './files'
import { settingsState, settingsActions } from './settings'
import { featuresState, featuresActions } from './features'
import { terminalState, terminalActions } from './terminal'
import { containerState, containerActions } from './container'
import { definitionsState, definitionsActions } from './definitions'

export const preloadedState = {
  app: appState,
  container: containerState,
  definitions: definitionsState,
  features: featuresState,
  files: filesState,
  modal: modalState,
  repo: repoState,
  user: userState,
  settings: settingsState,
  terminal: terminalState
}

export const reducer = combineReducers<TState>({
  app: createReducer(appState, appActions),
  container: createReducer(containerState, containerActions),
  definitions: createReducer(definitionsState, definitionsActions),
  features: createReducer(featuresState, featuresActions),
  files: createReducer(filesState, filesActions),
  modal: createReducer(modalState, modalActions),
  repo: createReducer(repoState, repoActions),
  repos: createReducer(reposState, reposActions),
  settings: createReducer(settingsState, settingsActions),
  terminal: createReducer(terminalState, terminalActions),
  user: createReducer(userState, userActions)
})
