import { CombinedState, combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'
import { TRepoState, repoState, repoActions } from './repo'
import { TUserState, userState, userActions } from './user'

export type {
  TRepoState,
  TUserState
}

export type TCombinedState = {
  repo: TRepoState,
  user: TUserState,
}
export type TState = CombinedState<TCombinedState>
export type TStateKey = keyof TState


export const preloadedState = {
  repo: repoState,
  user: userState,
}
export const reducer = combineReducers<TState>({
  repo: createReducer(repoState, repoActions),
  user: createReducer(userState, userActions)
})
