import type { TRouteMeta } from '@types'

import { getStore } from '@store'
import { EContainerState } from '@types'
import { addToast } from '@actions/toasts'
import { isEmptyColl } from '@keg-hub/jsutils'
import { connectModal } from '@actions/modals/modals'
import { containerApi } from '@services/containerApi'
import { setErrorState } from '@actions/admin/provider/setErrorState'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 */
export const statusContainer = async (
  params?:Record<any, any>
):Promise<TRouteMeta | Error | string | void> => {
  addToast({
    type: 'info',
    message: `Getting Session status...`,
  })

  const {
    data,
    error,
    success
  } = await containerApi.status({...params })

  if(!success || error) return setErrorState(error)

  await setContainerRoutes(data)

  const { repo } = getStore().getState()
  const containerState = data?.meta?.state

  containerState === EContainerState.Creating
    && isEmptyColl(repo)
    && connectModal()

  return containerState !== EContainerState.RUNNING
    ? await waitForRunning()
    : data
}
