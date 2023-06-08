import type { TFormattedUser, TRouteMeta, TValidateResp } from '@types'

import { HttpMethods } from '@constants'
import { emptyObj } from '@keg-hub/jsutils'
import { apiRequest } from '@utils/api/apiRequest'
import { getContainerData } from '@utils/store/getStoreData'


export type TContainerRemove = {
  id?:string
}

export class ContainerApi {
  
  containerPath = `/container`
  validatePath = `/auth/validate`

  validate = async (params:TFormattedUser) => {
    return await apiRequest<TValidateResp>({
      params,
      url: this.validatePath,
      method: HttpMethods.POST,
    })
  }


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
