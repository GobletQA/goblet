import type { TApiConnectReq, TApiRepoResp } from '@types'
import { setRepo } from '../local/setRepo'
import { addToast } from '@actions/toasts'
import { repoApi } from '@services/repoApi'
import { deepMerge } from '@keg-hub/jsutils'


/**
 * Calls Backend API to connect a git repo
 * If successful, makes calls to other actions to setup the UI
 *
 */
export const connectRepo = async (params:TApiConnectReq) => {
  addToast({
    type: 'info',
    message: `Connecting to repo ...`,
  })

  const {
    data,
    error,
    success
  } = await repoApi.connect<TApiRepoResp, TApiConnectReq>({
    params
  })

  if (!success || error)
    return addToast({
      type: 'error',
      message: error || `Failed connecting repo, please try again later.`,
    })

  // Set the repo data in the store
  setRepo(data)

  data.repo &&
    addToast({
      type: 'success',
      message: `Repo connected successfully`,
    })

  return data.repo
}
