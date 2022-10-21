import { ModalTypes } from '@constants'
import { GitUser } from '@services/gitUser'
import { WSService } from '@services/socketService'
import { localStorage } from '@services/localStorage'
import { getProviderMetadata } from '@services/providers'
import { setActiveModal } from '@actions/modals/setActiveModal'
import { clearContainerRoutes } from '@actions/container/local/clearContainerRoutes'


const { auth } = getProviderMetadata()

/**
 * Calls the authProviders sign out method to sign out the currently signed in user
 * @public
 * @function
 *
 * @return {Void}
 */
export const signOutAuthUser = async () => {
  // REMEMBER - THIS WILL CAUSE CONNECT MODAL TO NOT SHOW UP ON LOGIN
  // return undefined

  // Remove the local cache
  try { await localStorage.cleanup() }
  catch(err:any){ console.error(`Error clearing local storage.\n${err.message}`) }

  // Remove the container routes from redux store
  try { await clearContainerRoutes(false) }
  catch(err:any){ console.error(`Error clearing container routes.\n${err.message}`) }

  // Disconnect from the web-socket server
  try { await WSService.disconnect() }
  catch(err:any){ console.error(`Error disconnecting from websocket.\n${err.message}`) }

  // Log-out the github user
  const currentUser = GitUser.getUser()

  try {
    // Remove local user data here
    GitUser.signOut()
  }
  catch(err:any){ console.error(`Error logging out github user.\n${err.message}`) }

  currentUser &&
    console.info(`[Auth State Info] Logging out of of Goblet-Admin`)

// Disconnect from the web-socket server
  try { await auth.signOut() }
  catch(err:any){ console.error(`Error in auth sign out.\n${err.message}`) }

  // Open the sign in modal to force the user to re-sign in
  setActiveModal(ModalTypes.SIGN_IN)
}
