import { Values } from 'GBConstants'
import { setRepo } from '../local/setRepo'
import { addToast } from 'GBActions/toasts'
import { apiRequest } from 'GBUtils/api/apiRequest'
import { setActiveSidebar } from 'GBActions/sidebar'

const { SIDEBAR_TYPES } = Values

/**
 * Calls Backend API to connect a git repo
 * If successful, makes calls to other actions to setup the UI
 *
 */
export const connectRepo = async params => {
  addToast({
    type: 'info',
    message: `Connecting to repo ...`,
  })

  const {
    data,
    error,
    success
  } = await apiRequest({
    params,
    method: 'POST',
    url: `/repo/connect`,
  })

  if (!success || error)
    return addToast({
      type: 'error',
      message: error || `Failed connecting repo, please try again later.`,
    })

  // Set the repo data in the store
  setRepo(data)

  // Setup the sidebar
  setActiveSidebar(SIDEBAR_TYPES.FILE_TREE)

  data.repo &&
    addToast({
      type: 'success',
      message: `Repo connected successfully`,
    })

  return data.repo
}
