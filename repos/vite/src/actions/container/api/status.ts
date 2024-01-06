import type { TRouteMeta } from '@types'

import { addToast } from '@actions/toasts'
import { emptyObj } from '@keg-hub/jsutils'
import { Exception } from '@services/sharedService'
import { containerApi } from '@services/containerApi'
import { updateContainerState } from './updateContainerState'

export type TStatusContainer = {
  fromIdle?:boolean
  params?:Record<any, any>
  status?:TRouteMeta
}

/**
 * Calls the Backend API to get the current status of a connected repo ( mounted || via git )
 */
export const statusContainer = async (
  props:TStatusContainer=emptyObj
):Promise<TRouteMeta | Error | string | void> => {

  addToast({
    type: `info`,
    message: `Getting Session status...`,
  })

  let status = props.status
  if(!status){
    const {
      data,
      error,
      success,
      statusCode,
    } = await containerApi.status(props.params)

    status = data

    if(!success || error)
      return new Exception(error || `Container status request failed`, statusCode)
  }
  
  return await updateContainerState(status)

}
