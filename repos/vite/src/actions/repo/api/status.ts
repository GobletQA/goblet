import type { TApiRepoResp, TStatusRoutes, TRepoStatus, TRouteMeta } from '@types'

import { ModalTypes, StatusTypes } from '@constants'
import { setRepo } from '../local/setRepo'
import { addToast } from '@actions/toasts'
import { removeRepo } from '../local/removeRepo'
import { setActiveModal } from '@actions/modals'
import { apiRequest } from '@utils/api/apiRequest'
import { checkCall, noOpObj } from '@keg-hub/jsutils'
import { localStorage } from '@services/localStorage'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'


type TStatusRepo = Omit<TRouteMeta, "routes"> & {
  routes?: TStatusRoutes
}

/**
 * When no mounted repo
 *   * Open git modal when in vnc mode
 *   * Else open the mount warning when in local mode
 * If no locally mounted repo
 * Clear and cache repo data in the store or local storage
 * 
 * @param {Object} status - Status object returned from the API
 * 
 * @returns {Object} - Passed in status object
 */
const setNoLocalMountState = async (status:TRepoStatus) => {
  if(status.mode === StatusTypes.VNC)
    return setActiveModal(ModalTypes.CONNECT)

  addToast({
    type: 'warn',
    message: status.message,
  })
  await removeRepo()

  return status
}


/**
 * Clear and cache repo data in the store or local storage
 * Then opens the sign in modal and opens a toast warning about the error
 *
 * @param {string} error - Error message returned from the API
 * @param {Object} data - Metadata about the API call
 * 
 * @returns {Object} - Passed in status object
 */
const setErrorState = async (error:any) => {
  await removeRepo()
  await signOutAuthUser()
  setActiveModal(ModalTypes.SIGN_IN)
}

/**
 * Called when the repo status is not returned from the API
 * Shows a toast warning about status
 *
 * @param {Object} status - Status object returned from the API
 *
 * @returns {Object} - Passed in status object
 */
const setNoRepoStatus = (status:TRepoStatus) => {
  addToast({
    type: 'error',
    message: `Repo status could not be determined`,
  })

  return status
}

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 * @param {Object} params - Arguments for making the Backend API call
 * @param {Object} params.status - Status of the users session container
 * 
 * @returns {Object} - status object returned from the Backend API
 */
export const statusRepo = async ({
  routes=noOpObj as TStatusRoutes,
  ...params
}:TStatusRepo=noOpObj as TStatusRepo) => {

  addToast({
    type: 'info',
    message: `Getting Repo status...`,
  })

  const savedRepo = await localStorage.getRepo()

  const {
    data,
    error,
    success
  } = await apiRequest<TApiRepoResp>({
    method: 'GET',
    url: `/repo/status`,
    headers: routes?.[`7006`]?.headers,
    params: {...params, ...savedRepo?.git},
  })

  if(!success || error) return setErrorState(error)

  return !data?.status?.mounted
      ? setNoLocalMountState(data?.status as TRepoStatus)
      : !data?.repo
        ? setNoRepoStatus(data?.status)
        : checkCall(() => {
            setRepo(data)
            return data?.status
          })
}
