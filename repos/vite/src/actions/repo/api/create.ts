import type { TApiCreateReq, TApiRepoResp } from '@types'
import { setRepo } from '../local/setRepo'
import { addToast } from '@actions/toasts'
import { repoApi } from '@services/repoApi'

/**
 * Calls Backend API to create a new git repo
 * If successful, makes calls to other actions to setup the UI
 *
 */
export const createRepo = async (params:TApiCreateReq) => {
  addToast({
    type: 'info',
    message: `Creating new repo ...`,
  })

  const {
    data,
    error,
    success
  } = await repoApi.create<TApiRepoResp, TApiCreateReq>({
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
