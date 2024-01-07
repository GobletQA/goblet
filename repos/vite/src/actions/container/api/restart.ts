import type { TApiConnectReq, TApiRepoResp } from '@types'

import { addToast } from '@actions/toasts'
import { Exception } from '@services/sharedService'
import { connectModal } from '@actions/modals/modals'
import { containerApi } from '@services/containerApi'
import { removeRepo } from '../../repo/local/removeRepo'
import { getContainerData } from '@utils/store/getStoreData'
import { clearContainerRoutes } from '../local/clearContainerRoutes'
import { waitForRunning } from '@actions/container/api/waitForRunning'
import { waitingContainer } from '@actions/container/local/waitingContainer'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

export type TRestartContainer = {
  id?:string
}

export const restartContainer = async (params:TRestartContainer) => {

  const containerId = params?.id || getContainerData()?.meta?.id

  addToast({
    type: `info`,
    message: `Restarting session container...`,
  })

  waitingContainer(true)
  connectModal()

  // Clear the local cache before connecting a new repo
  await removeRepo()

  const {
    data,
    error,
    success,
    statusCode,
  } = await containerApi.restart({id: containerId})

  try {
    setContainerRoutes(data)
  }
  catch(err){
    console.log(err)
  }

  if(!success || error)
    return new Exception(error || `Container status request failed`, statusCode)

  clearContainerRoutes()

  return await waitForRunning()

}