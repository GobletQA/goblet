import type { TFileTree } from '@types'
import { setFileTree } from '../local/setFileTree'
import { addToast } from '@actions/toasts/addToast'
import { apiRepoRequest } from '@utils/api/apiRepoRequest'

/**
 * Makes call to the backend API to load the fileTree
 * Then calls setFileTree to update the store with new file-tree data
 * Which overwrites the existing store data
 * Can be used to re-load the fileTree after a new file has been created
 */
export const getFileTree = async () => {
  const {
    data,
    error,
    success
  } = await apiRepoRequest<TFileTree>(`/files/tree`)

  if (!success || error)
    return addToast({
      type: 'error',
      message: error || `Error loading File-Tree, please try again later.`,
    })

  data && setFileTree(data)

  return data
}
