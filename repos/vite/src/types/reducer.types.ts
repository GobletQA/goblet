import { CombinedState } from 'redux'
import { TAppState } from '@reducers/app'
import { TRepoState } from '@reducers/repo'
import { TPageState } from '@reducers/page'
import { TFilesState } from '@reducers/files'
import { TReposState } from '@reducers/repos'
import { TModalState } from '@reducers/modal'
import { TSettingsState } from '@reducers/settings'
import { TTestRunsState } from '@reducers/testRuns'
import { TContainerState } from '@reducers/container'
import { TDefinitionsState } from '@reducers/definitions'
import { TUserState, TUser, TUserEmptyState } from '@reducers/user'

export type {
  TAppState,
  TContainerState,
  TDefinitionsState,
  TFilesState,
  TModalState,
  TRepoState,
  TReposState,
  TPageState,
  TSettingsState,
  TUser,
  TUserState,
  TTestRunsState,
  TUserEmptyState
}

export type TCombinedState = {
  app: TAppState
  page: TPageState
  testRuns: TTestRunsState
  container: TContainerState
  definitions: TDefinitionsState
  files: TFilesState
  modal: TModalState
  repo: TRepoState
  repos: TReposState
  settings: TSettingsState
  user: TUserState
}
export type TState = CombinedState<TCombinedState>
export type TStateKey = keyof TState

export type TReduxAction = {
  type: string
  payload?: any
}

export interface TBasicAction {
  type: string
}

export interface TActionPayload<P = void> extends TBasicAction {
  payload: P
}

export type TReducerFunc<T> = (state: T, action: any) => T

export type TActionReducers<T> = { [actionName: string]: TReducerFunc<T> }

type TDispatcher<T extends (state: any, action: TBasicAction) => any> =
  Parameters<T>[1] extends TActionPayload<infer P> ? (payload?: P) => void : () => void

export type TAnyReducerFuncs = {
  [name: string]: (state: any, action: any) => any
}

export type TActionDispatcher<T extends TAnyReducerFuncs> = {
  [K in keyof T]: TDispatcher<T[K]>
}

export type TDspAction<T> = {
  type: string
  payload: T
}