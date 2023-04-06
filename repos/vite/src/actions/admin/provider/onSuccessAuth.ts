import type {
  TUserState,
  TRawAuthUser,
  TValidateResp,
} from '@types'

import { omitKeys } from '@keg-hub/jsutils'
import { GitUser } from '@services/gitUser'
import { apiRequest } from '@utils/api/apiRequest'
import { EAuthType, EContainerState } from '@types'
import { signOutAuthUser } from './signOutAuthUser'
import { formatUser } from '@utils/admin/formatUser'
import { localStorage } from '@services/localStorage'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'


/**
 * Validate the response from the Backend API
 * Ensure we have all the correct Provider user metadata
 */
const validateResp = (resp:TValidateResp) => {
  if (!resp || resp.error || !resp.username || !resp.id || !resp.provider || !resp.jwt)
    throw new Error(resp?.error || `Invalid user authentication`)

  const { jwt, status, ...user } = resp

  return {
    jwt,
    user,
    status,
  }
}

/**
 * Called when a user is authorized to access Goblet-Admin
 * If they are a new user, it creates a new user and account
 * On each sign in, it also saves the users auth token, which can be used for accessing the git provider
 * Then loads the Dashboard root
 */
export const onSuccessAuth = async (authData:TRawAuthUser, type:EAuthType) => {
  let statusCodeNum

  try {
    const userData = await formatUser(authData, type)
    if(!userData) return

    // TODO: update this so show a message
    // The user has logged in, and now we spin up a container for them
    // This can take a while, so ensure we update the user so they know what's happening
    // Also encrypt the user data to ensure it's not passed on via plain-text

    const {
      data,
      error,
      success,
      statusCode,
    } = await apiRequest<TValidateResp>({
      params: userData,
      method: 'POST',
      url: `/auth/validate`,
    })

    statusCodeNum = statusCode
    // If response if false, the session is invalid, and the user must sign in again
    if(error || !success) throw new Error(error)

    const {status, user, jwt} = validateResp(data)
    await localStorage.setJwt(jwt)

    // Remove user token when saving to local storage
    await localStorage.setUser(omitKeys(userData, [`token`]))
    new GitUser(user as TUserState)
    
    status?.meta?.state === EContainerState.CREATING && waitForRunning()

    // Wrap container and repos so if they throw, the login auth is still valid
    try {
      await setContainerRoutes(status)
    }
    catch(err:any){
      console.warn(`[Auth State Error] Error setting Container or Repos status.`)
      console.error(err.message)
    }
  }
  catch (err:any) {
    console.warn(
      `[Auth State Error] Could not validate user. Please try agin later.`
    )
    console.error(err.message)
    ;(!statusCodeNum || statusCodeNum === 401) && await signOutAuthUser()

  }
}
