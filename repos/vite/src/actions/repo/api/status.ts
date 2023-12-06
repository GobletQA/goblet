import type {
  TApiRepoResp,
  TStatusRoutes,
  TRepoStatus,
  TRouteMeta,
} from '@types'

import { setRepo } from '../local/setRepo'
import { addToast } from '@actions/toasts'
import { connectModal } from '@actions/modals'
import { removeRepo } from '../local/removeRepo'
import { apiRequest } from '@utils/api/apiRequest'
import { Exception } from '@services/sharedService'
import { StatusTypes, AuthActive } from '@constants'
import { localStorage } from '@services/localStorage'
import { checkCall, noOpObj } from '@keg-hub/jsutils'
import { ScreencastPort } from '@constants/screencast'

type TStatusRepo = Omit<TRouteMeta, "routes" | "meta"> & {
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
  if(AuthActive && status.mode === StatusTypes.VNC){
    connectModal()
    return status
  }

  addToast({
    type: 'warn',
    message: status.message,
  })
  await removeRepo()

  return status
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
}:TStatusRepo=noOpObj as TStatusRepo):Promise<TRepoStatus|Error> => {

  addToast({
    type: 'info',
    message: `Getting Repo status...`,
  })

  const savedRepo = await localStorage.getRepo()

  const {
    data,
    error,
    success,
    statusCode
  } = await apiRequest<TApiRepoResp>({
    method: 'GET',
    url: `/repo/status`,
    params: {...savedRepo?.git},
    headers: routes?.[ScreencastPort]?.headers,
  })

  if(!success || error)
    return new Exception(error || `Repo status request failed`, statusCode)

  return !data?.status?.mounted
      ? setNoLocalMountState(data?.status as TRepoStatus)
      : !data?.repo
        ? setNoRepoStatus(data?.status)
        : checkCall(() => {
            setRepo(data)
            return data?.status
          }) as TRepoStatus
}
