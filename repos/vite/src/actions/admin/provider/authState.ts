import { signOutAuthUser } from './signOutAuthUser'
import { getProviderMetadata } from '@services/providers'
import { upsertUser } from '@actions/admin/user/upsertUser'

const { auth } = getProviderMetadata()

/**
 * Called when the user auth changes state for some reason
 * Validates the auth user still exists, and if not ensures the applications logs out
 * @callback
 * @function
 * @public
 * @param {Object} rawUser - User object returned from the provider
 *
 * @return {Void}
 */
export const authStateChange = async (rawUser:any) => {

  if (rawUser){
    const {
      email,
      photoURL,
      displayName,
    } = rawUser

    const hasPAT = Boolean(
      rawUser?.reloadUserInfo?.customAttributes && rawUser.reloadUserInfo.customAttributes !== `{}`
    )

     return upsertUser({
      email,
      hasPAT,
      displayName,
      photoUrl: photoURL,
     })
  }

  console.warn(`[Auth State Change] Auth User no longer exists.`, auth.currentUser)
  auth.currentUser && await signOutAuthUser()
}

// auth.onIdTokenChanged(authStateChange)
auth.onAuthStateChanged(authStateChange)