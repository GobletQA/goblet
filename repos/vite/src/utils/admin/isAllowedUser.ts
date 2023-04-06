import { Environment, AllowedUsers } from '@constants'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'


// If in a non-dev env, then we should check for user emails
// Only check if allowed user emails actually exist
const shouldCheckUser =
  AllowedUsers.length &&
  ['staging', 'qa', 'production'].includes(Environment)

/**
 * Ensure the user is authorized to sign in
 * For demo purposes when deployed disabled for now
 * Only allows specific emails to sign in via github
 *
 * @param {string} email - The email to validate
 * @throws
 *
 */
export const isAllowedUser = async (email:string, forceFail?:boolean) => {
  // TODO: Make this an API call to get the allowed users from the backend
  // That will make it easier to update when deployed
  if (!forceFail && (!shouldCheckUser || !AllowedUsers.length || AllowedUsers.includes(email)))
    return

  await signOutAuthUser()
  throw new Error(`[Auth State Error] User is not authorized!`)
}
