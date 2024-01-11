import type { TDspAction } from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { deepMerge } from '@keg-hub/jsutils'
import { createReducer, createAction } from '@reduxjs/toolkit'

export type TUserEmptyState = {
  id?:string
  email?:string
  hasPAT?:boolean
  photoUrl?:string
  username?:string
  provider?:string
  displayName?:string
}
export type TUser = Omit<TUserEmptyState, `id`|`username`|`provider`> & {
  id:string
  username:string
  provider:string
}

export type TUserState = TUserEmptyState | TUser

export const userState = {} as TUserState

const clearUser = createAction<TUserState>(`clearUser`)
const upsertUser = createAction<TUserState>(`upsertUser`)

export const userActions = {
  clearUser: (state:TUserState, action:TDspAction<TUserState>) => (userState),
  upsertUser: (state:TUserState, action:TDspAction<TUserState>) => deepMerge<TUserState>(state, action?.payload),
}

export const userReducer = createReducer(
  deepMerge(userState),
  (builder:ActionReducerMapBuilder<TUserState>) => {
    builder.addCase(clearUser, userActions.clearUser)
    builder.addCase(upsertUser, userActions.upsertUser)
  }
)
