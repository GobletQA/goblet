import {GitUser} from '@services/gitUser'
import { authApi } from '@services/authApi'
import { upsertUser } from '@actions/admin/user/upsertUser'

/**
 * Adds a custom claim on the Oauth user
 */
export const removeProviderPat = async () => {
  const user = GitUser.getUser()
  upsertUser({ hasPAT: false })

  user?.provider
    && await authApi.removeClaims({ claims: [user?.provider] })

}
