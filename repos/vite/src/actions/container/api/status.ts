import type { TRouteMeta } from '@types'

import { EContainerState } from '@types'
import { addToast } from '@actions/toasts'
import { emptyObj } from '@keg-hub/jsutils'
import { containerApi } from '@services/containerApi'
import { connectModal } from '@actions/modals/modals'
import { removeRepo } from '@actions/repo/local/removeRepo'
import { setErrorState } from '@actions/admin/provider/setErrorState'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'
import {clearContainerRoutes} from '../local/clearContainerRoutes'

export type TStatusContainer = {
  fromIdle?:boolean
  params?:Record<any, any>
}

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 */
export const statusContainer = async (
  props:TStatusContainer=emptyObj
):Promise<TRouteMeta | Error | string | void> => {
  
  const {
    params,
  } = props
  
  addToast({
    type: 'info',
    message: `Getting Session status...`,
  })

  const {
    data,
    error,
    success
  } = await containerApi.status(params)

  if(!success || error) return setErrorState(error)

  const containerState = data?.meta?.state

  if(containerState === EContainerState.Creating){
    clearContainerRoutes() 
    removeRepo()
    connectModal()
  }

  await setContainerRoutes(data)

  return containerState !== EContainerState.Running
    ? await waitForRunning()
    : data
}
