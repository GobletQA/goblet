import type { TRouteMeta } from '@types'
import { ContainerStates } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { apiRequest } from '@utils/api/apiRequest'
import { setContainerRoutes } from '@actions/container/local/setContainerRoutes'

const checkContainerState = async (params:any) => {
  return await apiRequest<TRouteMeta>({
    method: 'GET',
    url: `/container/state`,
    params: {...params },
  })
}

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
  } = await checkContainerState(params)

  // TODO: figure out proper error handling
  if(error){
    console.log(`Error getting the state of the container :(`)
    console.log(error)
    return {} as TRouteMeta
  }

  if(data?.meta?.state === ContainerStates.RUNNING) return data

  // Return a promise that resolves after 3 seconds
  // Then call the waitForRunning again to check on the container state
  return new Promise((res, rej) => {
    console.log(`Waiting 5 seconds to check container state...`)
    try {
      setTimeout(async () => {
        const nextCall = loopCalls + 1
        console.log(`Call #${nextCall}: Checking container state`)

        const data = await waitForRunning(params, nextCall)
        await setContainerRoutes(data)
        res(data)
      }, 5000)
    }
    catch(err) {
      rej(err)
    }
  })

}