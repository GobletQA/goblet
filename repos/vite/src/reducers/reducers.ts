import type { TState } from '@types'

import { combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'

import { appState, appReducer } from './app'
import { userState, userReducer } from './user'
import { repoState, repoReducer } from './repo'
import { modalState, modalReducer } from './modal'
import { reposState, reposReducer } from './repos'
import { filesState, filesReducer } from './files'
import { settingsState, settingsReducer } from './settings'
import { containerState, containerReducer } from './container'
import { screencastState, screencastReducer } from './screencast'
import { definitionsState, definitionsReducer } from './definitions'

export const preloadedState = {
  app: appState,
  repo: repoState,
  user: userState,
  files: filesState,
  modal: modalState,
  repos: reposState,
  settings: settingsState,
  container: containerState,
  screencast: screencastState,
  definitions: definitionsState,
}

export const reducer = combineReducers<TState>({
  app: appReducer,
  user: userReducer,
  repo: repoReducer,
  modal: modalReducer,
  repos: reposReducer,
  files: filesReducer,
  settings: settingsReducer,
  container: containerReducer,
  screencast: screencastReducer,
  definitions: definitionsReducer,
})
