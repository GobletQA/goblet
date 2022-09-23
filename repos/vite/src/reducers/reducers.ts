import { combineReducers } from 'redux'
import { createReducer } from '@reduxjs/toolkit'
import { userState, userActions } from './user'


export const preloadedState = {
  user: userState
}
export const reducer = combineReducers({
  user: createReducer(userState, userActions)
})
