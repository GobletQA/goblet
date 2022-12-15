import { get } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { GitUser } from '@services/gitUser'
import { removeRepo } from '../local/removeRepo'
import { apiRequest } from '@utils/api/apiRequest'
import { connectModal } from '@actions/modals/modals'

export const disconnectRepo = async (username?:string) => {
  addToast({
    type: 'info',
    message: `Disconnecting repo...`,
  })

  // Remove the repo locally first
  await removeRepo()

  username = username || GitUser.getUser()?.username

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
  connectModal()

}
