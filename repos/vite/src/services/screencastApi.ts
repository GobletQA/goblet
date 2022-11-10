import type { TValueGroup } from '@types'
import { HttpMethods } from '@constants'
import { apiRequest } from '@utils/api/apiRequest'

type TServiceStatus = {
  browser: TValueGroup
  [key:string]: any
}

type TBrowserAction = {
  [key:string]: any
}

class ScreencastApi {
  
  basePath:string = `/screencast`
  browserPath:string = `/screencast/browser`

  serviceStatus = async (serviceOpts:TServiceStatus) => {
    return await apiRequest({
      params: serviceOpts,
      method: HttpMethods.GET,
      url: `${this.basePath}/status`,
    })
  }

  start = async (browserOpts:TValueGroup) => {
    return await apiRequest({
      params: browserOpts,
      method: HttpMethods.GET,
      url: `${this.browserPath}/start`,
    })
  }

  status = async (browserOpts:TValueGroup) => {
    return await apiRequest({
      params: browserOpts,
      method: HttpMethods.GET,
      url: `${this.browserPath}/status`,
    })
  }

  stop = async (browserOpts:TValueGroup) => {
    return await apiRequest({
      params: browserOpts,
      method: HttpMethods.POST,
      url: `${this.browserPath}/stop`,
    })
  }

  restart = async (browserOpts:TValueGroup) => {
    return await apiRequest({
      params: browserOpts,
      method: HttpMethods.POST,
      url: `${this.browserPath}/restart`,
    })
  }

  action = async (actionOpts:TBrowserAction) => {
    return await apiRequest({
      params: actionOpts,
      method: HttpMethods.POST,
      url: `${this.browserPath}/action`,
    })
  }

}

export const screencastApi = new ScreencastApi()