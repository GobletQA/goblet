import type { TRouteMeta } from '@types'

import { EContainerState } from '@types'
import { addToast } from '@actions/toasts'
import { apiRequest } from '@utils/api/apiRequest'
import { setErrorState } from '@actions/admin/provider/setErrorState'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 */
export const statusContainer = async (
  params?:Record<any, any>
):Promise<TRouteMeta | undefined> => {
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

  return data?.meta?.state !== EContainerState.RUNNING
    ? await waitForRunning()
    : data
}
