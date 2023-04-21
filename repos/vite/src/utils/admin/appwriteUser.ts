import type { TAWUserRaw, TFormattedUser } from '@types'

import { EProvider } from '@types'

export const appwriteUser = (authData: TAWUserRaw) => {
  const { session, user } = authData
  const {
    name,
    email,
    $id:id,
  } = user
  
  const {
    expire,
    providerAccessToken,
    providerRefreshToken,
  } = session
  
  return {
    id,
    email,
    expire,
    displayName: name,
    token: providerAccessToken,
    provider: EProvider.Github,
    refreshToken: providerRefreshToken,
    username: email.split(`@`).shift(),
  } as TFormattedUser
}