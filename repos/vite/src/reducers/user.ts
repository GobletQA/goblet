import type { TDspAction } from '@types'
import { deepMerge } from '@keg-hub/jsutils'

export type TUserEmptyState = {
  id?:string
  username?: string
  provider?: string
  email?: string
  reposUrl?: string
  photoUrl?: string
  displayName?: string
}
export type TUser = Omit<TUserEmptyState, `id`|`username`|`provider`> & {
  id:string
  username: string
  provider: string
}

export type TUserState = TUserEmptyState | TUser

export const userState = {} as TUserState

export const userActions = {
  clearUser: (state:TUserState, action:TDspAction<TUserState>) => (userState),
  upsertUser: (state:TUserState, action:TDspAction<TUserState>) => deepMerge<TUserState>(state, action?.payload),
}

