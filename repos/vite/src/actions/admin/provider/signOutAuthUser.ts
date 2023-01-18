import { AuthActive } from '@constants'
import { GitUser } from '@services/gitUser'
import { signInModal } from '@actions/modals/modals'
import { localStorage } from '@services/localStorage'
import { getProviderMetadata } from '@services/providers'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import { WSService } from '@services/socketService/socketService'
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
  if(!AuthActive) return

  // Log-out the github user
  const currentUser = GitUser.getUser()

  try { await disconnectRepo(currentUser?.username, false) }
  catch(err:any){ console.error(`Error disconnecting mounted repo.\n${err.message}`) }

  // Remove the local cache
  try { await localStorage.cleanupSession() }
  catch(err:any){ console.error(`Error clearing local storage.\n${err.message}`) }

  // Remove the container routes from redux store
  try { await clearContainerRoutes(false) }
  catch(err:any){ console.error(`Error clearing container routes.\n${err.message}`) }

  // Disconnect from the web-socket server
  try { await WSService.disconnect() }
  catch(err:any){ console.error(`Error disconnecting from websocket.\n${err.message}`) }

  // Remove local user data here
  try { GitUser.signOut() }
  catch(err:any){ console.error(`Error logging out github user.\n${err.message}`) }

  currentUser &&
    console.info(`[Auth State Info] Logging out of of Goblet-Admin`)

// Disconnect from the web-socket server
  try { await auth.signOut() }
  catch(err:any){ console.error(`Error in auth sign out.\n${err.message}`) }

  // Open the sign in modal to force the user to re-sign in
  signInModal()
}
