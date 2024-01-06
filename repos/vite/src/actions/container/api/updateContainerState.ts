import type { TRouteMeta } from '@types'

import { EContainerState } from '@types'
import { connectModal } from '@actions/modals/modals'
import { removeRepo } from '@actions/repo/local/removeRepo'
import {clearContainerRoutes} from '../local/clearContainerRoutes'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

export const updateContainerState = async (status:TRouteMeta) => {

  const containerState = status?.meta?.state
  if(containerState === EContainerState.Creating){
    clearContainerRoutes() 
    removeRepo()
    connectModal()
  }

  await setContainerRoutes(status)

  return containerState !== EContainerState.Running
    ? await waitForRunning()
    : status

}
