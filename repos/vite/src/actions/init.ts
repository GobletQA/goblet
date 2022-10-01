import { ModalTypes } from '@constants'
import { loadUser } from '@actions/admin/user/loadUser'
import { statusContainer } from '@actions/container/api'
import { setActiveModal } from '@actions/modals/setActiveModal'

export const initApp = async () => {

  // Load the local storage user if they exist
  const activeUser = await loadUser()
  if(!activeUser) return setActiveModal(ModalTypes.SIGN_IN)

  // If user is logged in, check the status of users session container
  const status = await statusContainer()

}
