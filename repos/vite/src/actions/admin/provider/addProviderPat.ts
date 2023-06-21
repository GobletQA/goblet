import type { TRawAuthUser } from '@types'

import {GitUser} from '@services/gitUser'
import { authApi } from '@services/authApi'

/**
 * Adds a custom claim on the Oauth user
 */
export const addProviderPat = async (pat:string) => {
  const user = GitUser.getUser()
  if(!user?.provider) throw new Error(`Can not set PAT, missing Git Cloud Provider`)

  return await authApi.addClaims({ [user?.provider]: pat })
}
