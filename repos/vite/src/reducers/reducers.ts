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
import { containerState, containerActions } from './container'
import { definitionsState, definitionsActions } from './definitions'

export const preloadedState = {
  app: appState,
  container: containerState,
  definitions: definitionsState,
  files: filesState,
  modal: modalState,
  repo: repoState,
  user: userState,
  settings: settingsState,
}

export const reducer = combineReducers<TState>({
  app: createReducer(appState, appActions),
  container: createReducer(containerState, containerActions),
  definitions: createReducer(definitionsState, definitionsActions),
  files: createReducer(filesState, filesActions),
  modal: createReducer(modalState, modalActions),
  repo: createReducer(repoState, repoActions),
  repos: createReducer(reposState, reposActions),
  settings: createReducer(settingsState, settingsActions),
  user: createReducer(userState, userActions)
})
