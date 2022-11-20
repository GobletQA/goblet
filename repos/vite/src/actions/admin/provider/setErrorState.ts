import { AuthActive } from '@constants'
import { signInModal } from '@actions/modals'
import { removeRepo } from '@actions/repo/local/removeRepo'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'

/**
 * Clear and cache repo data in the store or local storage
 * Then opens the sign in modal and opens a toast warning about the error
 *
 * @param {string} error - Error message returned from the API
 * @param {Object} data - Metadata about the API call
 * 
 * @returns {Object} - Passed in status object
 */
export const setErrorState = async (error:any) => {
  if(!AuthActive) return

  await removeRepo()
  await signOutAuthUser()
  signInModal()
  
  return undefined
}