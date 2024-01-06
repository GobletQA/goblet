import type { TValueGroup, TRepoApiObj, TBrowserDebuggerCfg } from '@types'

import { HttpMethods } from '@constants'
import {emptyObj} from '@keg-hub/jsutils'
import { apiRequest } from '@utils/api/apiRequest'
import { repoApiObj } from '@utils/repo/repoApiObj'

type TServiceStatus = {
  repo?:TRepoApiObj
  browser: TValueGroup
  [key:string]: any
}

export type TBrowserAction = {
  ref:`page`|`context`|`browser`,
  actions: Record<any, any>[]
  repo?:TRepoApiObj
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

  resetIdle = async () => {
    return await apiRequest({
      method: HttpMethods.GET,
      url: `${this.basePath}/reset/idle`,
    })
  }

  status = async (browserOpts:TValueGroup) => {
    browserOpts.repo = repoApiObj(browserOpts.repo)

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
    browserOpts.repo = repoApiObj(browserOpts.repo)

    return await apiRequest({
      params: browserOpts,
      method: HttpMethods.POST,
      url: `${this.browserPath}/restart`,
    })
  }

  action = async (actionOpts:TBrowserAction) => {
    actionOpts.repo = repoApiObj(actionOpts.repo)

    return await apiRequest({
      params: actionOpts,
      method: HttpMethods.POST,
      url: `${this.browserPath}/action`,
    })
  }

  debugger = async (debuggerOpts:TValueGroup=emptyObj) => {
    return await apiRequest<TBrowserDebuggerCfg>({
      params: debuggerOpts,
      method: HttpMethods.GET,
      url: `${this.browserPath}/debugger`,
    })
  }

}

export const screencastApi = new ScreencastApi()