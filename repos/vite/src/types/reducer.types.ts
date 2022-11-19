import { CombinedState } from 'redux'
import { TRepoState } from '@reducers/repo'
import { TUserState } from '@reducers/user'
import { TFilesState } from '@reducers/files'
import { TReposState } from '@reducers/repos'
import { TModalState } from '@reducers/modal'
import { TSettingsState } from '@reducers/settings'
import { TTerminalState } from '@reducers/terminal'
import { TFeaturesState } from '@reducers/features'
import { TContainerState } from '@reducers/container'
import { TDefinitionsState } from '@reducers/definitions'

export type {
  TContainerState,
  TDefinitionsState,
  TFeaturesState,
  TFilesState,
  TModalState,
  TRepoState,
  TReposState,
  TSettingsState,
  TTerminalState,
  TUserState,
}

export type TCombinedState = {
  container: TContainerState
  definitions: TDefinitionsState
  features: TFeaturesState
  files: TFilesState
  modal: TModalState
  repo: TRepoState
  repos: TReposState
  settings: TSettingsState
  terminal: TTerminalState
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

export type TAction<T> = {
  type: string
  payload: T
}