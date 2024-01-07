import type { TRouteMeta } from '@types'

import { HttpMethods } from '@constants'
import { emptyObj } from '@keg-hub/jsutils'
import { apiRequest } from '@utils/api/apiRequest'
import { getContainerData } from '@utils/store/getStoreData'


export type TContainerRemove = {
  id?:string
  idleSignOut?:boolean
}

export class ContainerApi {

  containerPath = `/container`

  state = async (params:Record<any, any>=emptyObj) => {
    return await apiRequest<TRouteMeta>({
      params: {...params },
      method: HttpMethods.GET,
      url: `${this.containerPath}/state`,
    })
  }


  status = async (params:Record<any, any>=emptyObj) => {
    return await apiRequest<TRouteMeta>({
      params,
      method: HttpMethods.GET,
      url: `${this.containerPath}/status`,
    })
  }

  restart = async (params:Record<any, any>=emptyObj) => {
    const containerId = params?.id || getContainerData()?.meta?.id

    return await apiRequest<TRouteMeta>({
      params,
      method: HttpMethods.POST,
      url: `${this.containerPath}/restart/${containerId}`,
    })
  }


  remove = async (params:TContainerRemove=emptyObj) => {
    const containerId = params?.id || getContainerData()?.meta?.id

    return await apiRequest<TRouteMeta>({
      params,
      method: HttpMethods.POST,
      url: `${this.containerPath}/remove/${containerId}`,
    })
  }

}


export const containerApi = new ContainerApi()
