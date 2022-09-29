import { CombinedState, combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'
import {
  TRepoState,
  repoState,
  repoActions,
  repoDispatch
} from './repo'
import {
  TUserState,
  userState,
  userActions,
  userDispatch
} from './user'
import {
  TFeaturesState,
  featuresState,
  featuresActions,
  featuresDispatch
} from './features'

export type {
  TFeaturesState,
  TRepoState,
  TUserState
}

export type TCombinedState = {
  features: TFeaturesState
  repo: TRepoState
  user: TUserState
}
export type TState = CombinedState<TCombinedState>
export type TStateKey = keyof TState

export const preloadedState = {
  repo: repoState,
  user: userState,
  features: featuresState
}
export const reducer = combineReducers<TState>({
  features: createReducer(featuresState, featuresActions),
  repo: createReducer(repoState, repoActions),
  user: createReducer(userState, userActions)
})

export {
  featuresDispatch,
  repoDispatch,
  userDispatch,
}