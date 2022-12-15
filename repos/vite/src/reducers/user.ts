import type { TAction } from '@types'
import { deepMerge } from '@keg-hub/jsutils'

export type TUserState = {
  id?:string
  username?: string
  provider?: string
  email?: string | null
  displayName?: string | null
}

export const userState = {} as TUserState

export const userActions = {
  clearUser: (state:TUserState, action:TAction<TUserState>) => (userState),
  upsertUser: (state:TUserState, action:TAction<TUserState>) => deepMerge<TUserState>(state, action?.payload),
}

