import { get } from '@keg-hub/jsutils'
import { ModalTypes } from '@constants'
import { addToast } from '@actions/toasts'
import { GitUser } from '@services/gitUser'
import { removeRepo } from '../local/removeRepo'
import { apiRequest } from '@utils/api/apiRequest'
import { setActiveModal } from '@actions/modals/setActiveModal'

export const disconnectRepo = async (username?:string) => {
  addToast({
    type: 'info',
    message: `Disconnecting repo...`,
  })

  // Remove the repo locally first
  await removeRepo()

  // @ts-ignore
  username = username || GitUser.getUser()?.username

  // Log-out the github user
  // Then call the backend api to unmount the repo
  const {data, error} = await apiRequest({
    method: 'POST',
    url: `/repo/disconnect`,
    params: {
      username,
    },
  }) as Record<any, any>

  error
    && error.message
    && addToast({
        type: 'error',
        message: error.message,
      })

  get(data, `repo.unmounted`) &&
    addToast({
      type: 'success',
      message: `Repo has been disconnected`,
    })

  // Open the connect repo modal after disconnecting
  setActiveModal(ModalTypes.CONNECT)

}
