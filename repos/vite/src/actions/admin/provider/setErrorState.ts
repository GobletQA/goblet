import { AuthActive } from '@constants'
import { signInModal } from '@actions/modals'
import { removeRepo } from '@actions/repo/local/removeRepo'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'

/**
 * Clear and cache repo data in the store or local storage
 * Then opens the sign in modal and opens a toast warning about the error
 */
export const setErrorState = async (error:any) => {
  if(!AuthActive) return new Error(error)

  console.log(`------- admin - setError State -------`)
  console.log(`------- remove repo and sign out user -------`)
  // await removeRepo()
  // await signOutAuthUser()
  // signInModal()

  return new Error(error)
}