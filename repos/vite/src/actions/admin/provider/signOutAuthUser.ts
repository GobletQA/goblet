import { AuthActive } from '@constants'
import { GitUser } from '@services/gitUser'
import { authApi } from '@services/authApi'
import { emptyObj } from '@keg-hub/jsutils'

import { signInModal } from '@actions/modals/modals'
import { localStorage } from '@services/localStorage'
import { getProviderMetadata } from '@services/providers'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import { clearTestRuns } from '@actions/testRuns/clearTestRuns'
import { WSService } from '@services/socketService/socketService'
import { clearContainerRoutes } from '@actions/container/local/clearContainerRoutes'

const { auth } = getProviderMetadata()

export type TSignOutOpts = {
  ws?:boolean
  user?:boolean
  repo?:boolean
  session?:boolean
  container?:boolean
  testRuns?:boolean
}

/**
 * Calls the authProviders sign out method to sign out the currently signed in user
 * @public
 * @function
 *
 * @return {Void}
 */
export const signOutAuthUser = async (opts:TSignOutOpts=emptyObj) => {
  if(!AuthActive) return

  // cache the current user, so we can access them later
  const currentUser = GitUser.getUser()

  // Ensure the auto token refresh timer is removed
  authApi.clearRefreshTimer()

  if(opts.repo !== false){
    try { await disconnectRepo(currentUser?.username, false) }
    catch(err:any){ console.error(`Error disconnecting mounted repo.\n${err.message}`) }
  }

  // Remove the local cache
  if(opts.session !== false){
    try { await localStorage.cleanupSession() }
    catch(err:any){ console.error(`Error clearing local storage.\n${err.message}`) }
  }

  // Remove the container routes from redux store
  if(opts.container !== false){
    try { await clearContainerRoutes() }
    catch(err:any){ console.error(`Error clearing container routes.\n${err.message}`) }
  }

  // Remove the container routes from redux store
  if(opts.testRuns !== false){
    try { clearTestRuns() }
    catch(err:any){ console.error(`Error clearing test runs.\n${err.message}`) }
  }

  // Disconnect from the web-socket server
  if(opts.ws !== false){
    try { await WSService.disconnect() }
    catch(err:any){ console.error(`Error disconnecting from websocket.\n${err.message}`) }
  }

  // Remove local user data here
  if(opts.user !== false){
    try { GitUser.signOut() }
    catch(err:any){ console.error(`Error logging out github user.\n${err.message}`) }

    currentUser &&
      console.info(`[Auth State Info] Logging out of of Goblet-Admin`)

  // Disconnect from the firebase auth
    try {
      await auth.signOut()
      // await account.deleteSession(`current`)
    }
    catch(err:any){ console.error(`Error in auth sign out.\n${err.message}`) }

    // Open the sign in modal to force the user to re-sign in
    signInModal()
  }


}
