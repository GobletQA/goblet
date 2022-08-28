import { Values } from 'HKConstants'
import { GitUser } from 'HKServices/gitUser'
import { isAuthActive } from 'HKUtils/isAuthActive'
import { WSService } from 'HKServices/socketService'
import { localStorage } from'HKUtils/storage/localStorage'
import { getProviderMetadata } from 'HKServices/providers'
import { setActiveModal } from 'HKActions/modals/setActiveModal'
import { clearContainerRoutes } from 'HKActions/container/local/clearContainerRoutes'

const { MODAL_TYPES } = Values
const authActive = isAuthActive()
const { auth } = getProviderMetadata()

/**
 * Calls the authProviders sign out method to sign out the currently signed in user
 * @public
 * @function
 *
 * @return {Void}
 */
export const signOutAuthUser = async () => {
  // Remove the local cache
  try { await localStorage.cleanup() }
  catch(err){ console.error(`Error clearing local storage.\n${err.message}`) }

  // Remove the container routes from redux store
  try { await clearContainerRoutes(false) }
  catch(err){ console.error(`Error clearing container routes.\n${err.message}`) }

  // Disconnect from the web-socket server
  try { await WSService.disconnect() }
  catch(err){ console.error(`Error disconnecting from websocket.\n${err.message}`) }

  // Log-out the github user
  const currentUser = GitUser.getUser()

  try {
    // Remove local user data here
    GitUser.signOut()
  }
  catch(err){ console.error(`Error logging out github user.\n${err.message}`) }

  // If no active auth, just return
  if (!authActive) return

  currentUser &&
    console.info(`[Auth State Info] Logging out of of Goblet-Admin`)

// Disconnect from the web-socket server
  try { await auth.signOut() }
  catch(err){ console.error(`Error in auth sign out.\n${err.message}`) }

  // Open the sign in modal to force the user to re-sign in
  setActiveModal(MODAL_TYPES.SIGN_IN)
}
