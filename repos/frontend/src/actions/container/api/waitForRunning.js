import { Values } from 'HKConstants'
import { noOpObj } from '@keg-hub/jsutils'
import { apiRequest } from 'HKUtils/api/apiRequest'
import { setContainerRoutes } from 'HKActions/container/local/setContainerRoutes'

const { CONTAINER } = Values

const checkContainerState = async (params) => {
  return await apiRequest({
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
export const waitForRunning = async (params=noOpObj, loopCalls=0) => {

  const {
    data,
    error,
  } = await checkContainerState(params)

  // TODO: figure out proper error handling
  if(error){
    console.log(`Error getting the state of the container :(`)
    console.log(error)
    return {}
  }

  if(data?.meta?.state === CONTAINER?.STATE?.RUNNING)
    return data

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

