import { ENVIRONMENT, ALLOWED_USERS } from '@constants'
import { signOutAuthUser } from './signOutAuthUser'


// If in a non-dev env, then we should check for user emails
// Only check if allowed user emails actually exist
const shouldCheckUser =
  ALLOWED_USERS.length &&
  ['staging', 'qa', 'production'].includes(ENVIRONMENT)

/**
 * Ensure the user is authorized to sign in
 * For demo purposes when deployed disabled for now
 * Only allows specific emails to sign in via github
 *
 * @param {string} email - The email to validate
 * @throws
 *
 */
export const isAllowedUser = async (email:string) => {
  // TODO: Make this an API call to get the allowed users from the backend
  // That will make it easier to update when deployed
  if (!shouldCheckUser || !ALLOWED_USERS.length || ALLOWED_USERS.includes(email))
    return

  await signOutAuthUser()
  throw new Error(`[Auth State Error] User is not authorized!`)
}
