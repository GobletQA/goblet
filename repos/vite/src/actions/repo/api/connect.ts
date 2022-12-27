import type { TApiRepoResp } from '@types'
import { setRepo } from '../local/setRepo'
import { addToast } from '@actions/toasts'
import { repoApi } from '@services/repoApi'
import { deepMerge } from '@keg-hub/jsutils'


export type TConnectRepo = {
  [key:string]: any
}

/**
 * Calls Backend API to connect a git repo
 * If successful, makes calls to other actions to setup the UI
 *
 */
export const connectRepo = async (params:TConnectRepo) => {
  addToast({
    type: 'info',
    message: `Connecting to repo ...`,
  })

  const {
    data,
    error,
    success
  } = await repoApi.connect<TApiRepoResp>({
    params: deepMerge({ createBranch: false }, params)
  })

  if (!success || error)
    return addToast({
      type: 'error',
      message: error || `Failed connecting repo, please try again later.`,
    })

  // Set the repo data in the store
  setRepo(data)

  // TODO: update the files in the monaco editor
  // setActiveSidebar(SIDEBAR_TYPES.FILE_TREE)

  data.repo &&
    addToast({
      type: 'success',
      message: `Repo connected successfully`,
    })

  return data.repo
}
