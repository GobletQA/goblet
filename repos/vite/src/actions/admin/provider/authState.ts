import type { TUserState } from "@reducers"
import type { NextOrObserver } from "firebase/auth"

import { onAuthStateChanged } from "firebase/auth"
import { signOutAuthUser } from './signOutAuthUser'
import { getProviderMetadata } from '@services/providers'


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
export const authStateChange = async (rawUser:Record<any, any>) => {
  if (rawUser) return

  console.warn(`[Auth State Change] Auth User no longer exists.`)

  await signOutAuthUser()
}

onAuthStateChanged(auth, authStateChange as NextOrObserver<TUserState>)
