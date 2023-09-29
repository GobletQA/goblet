import type { TBrowserNavEvt, TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TPageState = TBrowserNavEvt

export const pageState = {} as TPageState
const clearPage = createAction<TPageState>(`clearPage`)
const setPage = createAction<TPageState>(`setPage`)

export const pageActions = {
  clearPage: (state:TPageState, action:TDspAction<TPageState>) => (pageState),
  setPage: (state:TPageState, action:TDspAction<TPageState>) => action?.payload,
}

export const pageReducer = createReducer(
  deepMerge(pageState),
  (builder:ActionReducerMapBuilder<TPageState>) => {
    builder.addCase(clearPage, pageActions.clearPage)
    builder.addCase(setPage, pageActions.setPage)
  })



