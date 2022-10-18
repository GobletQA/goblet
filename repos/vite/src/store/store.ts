import type { TCombinedState, TReduxAction } from '@types'

import { get } from '@keg-hub/jsutils'
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

export const useSelect = (...items:string[]) => {
  return items.reduce((acc, item) => {
    const key = item.split(`.`).pop()
    acc[key as string] = useSelector((state) => get(state, item))
    return acc
  }, {} as Record<string, keyof TCombinedState>)
}

export const getStore = () => Store
export const getDispatch: () => AppDispatch = () => Store.dispatch
export const dispatch = (action: TReduxAction) => Store.dispatch(action)

export const select = <T>(func: (state: RootState) => T) => {
  const currentState = getStore().getState()
  return func(currentState) as T
}

export * from './dispatchers'
export * from './selectorHooks'
