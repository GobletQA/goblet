import { signOutAuthUser } from './signOutAuthUser'

/**
 * Calls the authProviders sign out method to sign out the currently signed in user
 * @callback
 * @function
 * @public
 *
 * @return {Void}
 */
export const onFailedAuth = (err?:Error, message?:string) => {
  console.error(`[Auth State Error] Authentication failed. ${err?.message || message || ``}`)
  signOutAuthUser()
}
