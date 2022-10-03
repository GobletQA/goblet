import type { TValidateResp } from '@types'

import { TUserState } from '@reducers'
import { GitUser } from '@services/gitUser'
import { pickKeys } from '@keg-hub/jsutils'
import { isAllowedUser } from './isAllowedUser'
import { apiRequest } from '@utils/api/apiRequest'
import { signOutAuthUser } from './signOutAuthUser'
import { localStorage } from '@services/localStorage'
import { setRepos } from '@actions/repo/local/setRepos'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

/**
 * Formats the response from the git provider sign in
 * Builds a user object from the provided data
 * @function
 * @private
 *
 * @param {Object} data - Response from Git Provider Sign In
 *
 * @return {Object} - Built user item
 */
const formatUser = (data:Record<any, any>) => {
  const { uid, email, displayName } = pickKeys(data.user, [
    'uid',
    'email',
    'displayName',
  ])

  const { screenName:username, profile } = pickKeys(data.additionalUserInfo, [
    'profile',
    'screenName',
  ])


  const { providerId, accessToken } = pickKeys(data.credential, [
    'accessToken',
    'providerId',
  ])

  return {
    id: uid,
    displayName,
    email: email,
    username: username,
    token: accessToken,
    provider: providerId,
    reposUrl: profile.repos_url,
  }
}

/**
 * Validate the response from the Backend API
 * Ensure we have all the correct Provider user metadata
 * @param {Object} resp - Response from the Backend API call
 * @throws
 * 
 * @return {Object} - Contains the user object and repos array returned from the Backend API
 */
const validateResp = (resp:TValidateResp) => {
  if (!resp || resp.error || !resp.username || !resp.id || !resp.provider || !resp.jwt)
    throw new Error(resp?.error || `Invalid user authentication`)

  const { repos, jwt, status, ...user } = resp

  return {
    jwt,
    repos,
    status,
    user,
  }
}

/**
 * Called when a user is authorized to access Goblet-Admin
 * If they are a new user, it creates a new user and account
 * On each sign in, it also saves the users auth token, which can be used for accessing the git provider
 * Then loads the Dashboard root
 * @callback
 * @function
 * @public
 *
 * @param {Object} data - Response from the Auth provider on a successful sign in
 *
 * @return {Void}
 */
export const onSuccessAuth = async (authData:Record<any, any>) => {
  try {
    const userData = formatUser(authData)
    await isAllowedUser(userData.email)

    // TODO: update this so show a message
    // The user has logged in, and now we spin up a container for them
    // This can take a while, so ensure we update the user so they know what's happening
    // Also encrypt the user data to ensure it's not passed on via plain-text

    const {
      data,
      error,
      success
    } = await apiRequest<TValidateResp>({
      params: userData,
      method: 'POST',
      url: `/auth/validate`,
    })

    // If response if false, the session is invalid, and the user must sign in again
    if(error || !success) throw new Error(error)

    const {repos, status, user, jwt} = validateResp(data)
    await localStorage.setJwt(jwt)
    new GitUser(user as TUserState)
    
    status?.meta?.state === `Creating` && waitForRunning()

    // Wrap container and repos so if they throw, the login auth is still valid
    try {
      repos && repos.length && setRepos({ repos })
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
    await signOutAuthUser()
  }
}
