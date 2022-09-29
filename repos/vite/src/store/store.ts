import type { TReduxAction } from '@reducers'

import { Store as ReduxStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { reducer, preloadedState } from '@reducers'
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux'


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reducer>
export type AppDispatch = typeof Store.dispatch

export const Store: ReduxStore<RootState> = configureStore({
  reducer,
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
})

export const useDispatch = () => useReduxDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export const getStore = () => Store
export const getDispatch: () => AppDispatch = () => Store.dispatch
export const dispatch = (action: TReduxAction) => Store.dispatch(action)

export const select = <T>(func: (state: RootState) => T) => {
  const currentState = getStore().getState()
  return func(currentState) as T
}
