import { Values } from 'GBConstants'
import { addToast } from 'GBActions/toasts'
import { setActiveModal } from 'GBActions/modals'
import { apiRequest } from 'GBUtils/api/apiRequest'
import { removeRepo } from 'GBActions/repo/local/removeRepo'
import { waitForRunning } from 'GBActions/container/api/waitForRunning'
import { signOutAuthUser } from 'GBActions/admin/provider/signOutAuthUser'
import { setContainerRoutes } from 'GBActions/container/local/setContainerRoutes'

const { MODAL_TYPES, CONTAINER } = Values

/**
 * Clear and cache repo data in the store or local storage
 * Then opens the sign in modal and opens a toast warning about the error
 *
 * @param {string} error - Error message returned from the API
 * @param {Object} data - Metadata about the API call
 * 
 * @returns {Object} - Passed in status object
 */
const setErrorState = async error => {
  await removeRepo()
  await signOutAuthUser()
  setActiveModal(MODAL_TYPES.SIGN_IN)
}

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 * @param {Object} params - Arguments for making the Backend API call
 * 
 * @returns {Object} - status object returned from the Backend API
 */
export const statusContainer = async params => {
  addToast({
    type: 'info',
    message: `Getting Session status...`,
  })

  const {
    data,
    error,
    success
  } = await apiRequest({
    method: 'GET',
    url: `/container/status`,
    params: {...params },
  })

  if(!success || error) return setErrorState(error)

  await setContainerRoutes(data)

  return data?.meta?.state !== CONTAINER?.STATE?.RUNNING
    ? await waitForRunning()
    : data
}
