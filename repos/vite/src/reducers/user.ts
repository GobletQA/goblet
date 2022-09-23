import type { TAction } from '@reducers'
import { deepMerge } from '@keg-hub/jsutils'

export type TUserState = {
  uid: string
  email: string
  providerId: string
  displayName?: string
  screenName?: string
  profile?: Record<string, any>
}

export const userState = {} as TUserState

export const userActions = {
  clear: (state:TUserState, action:TAction<TUserState>) => (userState),
  upsert: (state:TUserState, action:TAction<TUserState>) => deepMerge<TUserState>(state, action?.payload),
}

