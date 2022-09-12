import { GitUser } from 'GBServices/gitUser'

/**
 * Proxy action to the Admin gitUser.loadUser method
 */
export const loadUser = async () => {
  return await GitUser.loadUser()
}