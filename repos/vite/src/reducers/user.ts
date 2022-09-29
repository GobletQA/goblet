import type { TAction } from '@reducers'
import { deepMerge } from '@keg-hub/jsutils'
import { createDispatcher } from '@utils/dispatcher'

export type TUserState = {
  uid: string
  id?:string
  username?: string
  provider?: string
  providerId: string
  screenName?: string
  email: string | null
  displayName: string | null
  profile?: Record<string, any>
}

export const userState = {} as TUserState

export const userActions = {
  clear: (state:TUserState, action:TAction<TUserState>) => (userState),
  upsert: (state:TUserState, action:TAction<TUserState>) => deepMerge<TUserState>(state, action?.payload),
}

export const userDispatch = createDispatcher(userActions)