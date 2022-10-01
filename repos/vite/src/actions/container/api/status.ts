import type { TRouteMeta } from '@types'

import { ContainerStates, ModalTypes } from '@constants'
import { addToast } from '@actions/toasts'
import { apiRequest } from '@utils/api/apiRequest'
import { removeRepo } from '@actions/repo/local/removeRepo'
import { setActiveModal } from '@actions/modals/setActiveModal'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'


/**
 * Clear and cache repo data in the store or local storage
 * Then opens the sign in modal and opens a toast warning about the error
 *
 * @param {string} error - Error message returned from the API
 * @param {Object} data - Metadata about the API call
 * 
 * @returns {Object} - Passed in status object
 */
const setErrorState = async (error?:string) => {
  await removeRepo()
  await signOutAuthUser()
  setActiveModal(ModalTypes.SIGN_IN)
}

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 * @param {Object} params - Arguments for making the Backend API call
 * 
 * @returns {Object} - status object returned from the Backend API
 */
export const statusContainer = async (params?:Record<any, any>) => {
  addToast({
    type: 'info',
    message: `Getting Session status...`,
  })

  const {
    data,
    error,
    success
  } = await apiRequest<TRouteMeta>({
    method: 'GET',
    url: `/container/status`,
    params: {...params },
  })

  if(!success || error) return setErrorState(error)

  await setContainerRoutes(data)

  return data?.meta?.state !== ContainerStates.RUNNING
    ? await waitForRunning()
    : data
}
