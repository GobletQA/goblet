import { get } from '@keg-hub/jsutils'
import { addToast } from '@actions/toasts'
import { GitUser } from '@services/gitUser'
import { repoApi } from '@services/repoApi'
import { removeRepo } from '../local/removeRepo'

import { signInModal, connectModal } from '@actions/modals/modals'


const callDisconnectApi = async (username?:string) => {
  try {

    // Then call the backend api to unmount the repo
    const {data, error} = await repoApi.disconnect({ params: { username } }) as Record<any, any>

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
  }
  catch(err:any){
    console.warn(`API call /repo/disconnect failed`)
    console.error(err.stack)
  }
}

export const disconnectRepo = async (username?:string, openModel:boolean=true) => {
  addToast({
    type: 'info',
    message: `Disconnecting repo...`,
  })

  // Then remove the repo locally
  // Disconnect the repo on the backend base on username
  username = username || GitUser.getUser()?.username

  Promise.all([
    removeRepo(),
    username && await callDisconnectApi(username),
  ])

  if(!openModel) return

  if(!username) return signInModal()

  // Open the connect repo modal after disconnecting
  connectModal()
}
