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
  clear: (state:TUserState, action:TAction<TUserState>) => (userState),
  upsert: (state:TUserState, action:TAction<TUserState>) => deepMerge<TUserState>(state, action?.payload),
}

