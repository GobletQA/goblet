import type { TState } from '@types'

import { combineReducers } from 'redux'

import { appState, appReducer } from './app'
import { userState, userReducer } from './user'
import { repoState, repoReducer } from './repo'
import { pageState, pageReducer } from './page'
import { modalState, modalReducer } from './modal'
import { reposState, reposReducer } from './repos'
import { filesState, filesReducer } from './files'
import { jokerState, jokerReducer } from './joker'
import { settingsState, settingsReducer } from './settings'
import { testRunsState, testRunsReducer } from './testRuns'
import { containerState, containerReducer } from './container'
import { screencastState, screencastReducer } from './screencast'
import { definitionsState, definitionsReducer } from './definitions'

export const preloadedState = {
  app: appState,
  repo: repoState,
  user: userState,
  page: pageState,
  files: filesState,
  modal: modalState,
  repos: reposState,
  joker: jokerState,
  testRuns: testRunsState,
  settings: settingsState,
  container: containerState,
  screencast: screencastState,
  definitions: definitionsState,
}

export const reducer = combineReducers<TState>({
  app: appReducer,
  user: userReducer,
  repo: repoReducer,
  page: pageReducer,
  modal: modalReducer,
  repos: reposReducer,
  files: filesReducer,
  joker: jokerReducer,
  testRuns: testRunsReducer,
  settings: settingsReducer,
  container: containerReducer,
  screencast: screencastReducer,
  definitions: definitionsReducer,
})
