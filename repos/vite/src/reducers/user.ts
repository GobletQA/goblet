import type { TAction } from '@types'
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
  clearUser: (state:TUserState, action:TAction<TUserState>) => (userState),
  upsertUser: (state:TUserState, action:TAction<TUserState>) => deepMerge<TUserState>(state, action?.payload),
}

