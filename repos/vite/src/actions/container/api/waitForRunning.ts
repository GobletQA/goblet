import type { TRouteMeta } from '@types'
import { EContainerState } from '@types'
import { noOpObj } from '@keg-hub/jsutils'
import { containerApi } from '@services/containerApi'
import {ContainerCheckInterval} from '@constants/screencast'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'


/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 * @param {Object} params - Arguments for making the Backend API call
 * 
 * @returns {Object} - status object returned from the Backend API
 */
export const waitForRunning = async (
  params:any=noOpObj,
  loopCalls:number=0
):Promise<TRouteMeta> => {
  const {
    data,
    error,
  } = await containerApi.state(params)

  if(error){
    console.log(`Error getting the state of the container :(`)
    console.log(error)
    return {} as TRouteMeta
  }

  if(data?.meta?.state === EContainerState.RUNNING) return data

  // Return a promise that resolves after 3 seconds
  // Then call the waitForRunning again to check on the container state
  return new Promise((res, rej) => {
    console.log(`Waiting 4 seconds to check container state...`)
    try {
      setTimeout(async () => {
        const nextCall = loopCalls + 1
        console.log(`Call #${nextCall}: Checking container state`)

        const data = await waitForRunning(params, nextCall)
        await setContainerRoutes(data)
        res(data)
      }, ContainerCheckInterval)
    }
    catch(err) {
      rej(err)
    }
  })

}