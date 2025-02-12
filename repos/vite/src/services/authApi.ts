import type { TFormattedUser, TRouteMeta, TUserState, TValidateResp } from '@types'

import '@actions/admin/provider/authState'

import * as ComLink from 'comlink'
import { AppWorker } from '@workers'
import { HttpMethods } from '@constants'
import { getUserToken } from './providers'
import { GitUser } from '@services/gitUser'
import { apiRequest } from '@utils/api/apiRequest'
import { Exception } from '@services/sharedService'
import { localStorage } from '@services/localStorage'
import { emptyObj, omitKeys } from '@keg-hub/jsutils'
import { validateResp } from '@utils/api/validateResp'
import { signOutManually } from '@actions/admin/user/signOutManually'
import { signOutAuthUser } from '@actions/admin/provider/signOutAuthUser'

export type TAddClaimsRep = {
  jwt?:string
  refresh?:string
}

export type TValidateUserReq = (GitUser | TFormattedUser) & {
  pat?:string,
  refresh?:boolean
}

export class AuthApi {

  authPath = `/auth`
  refreshInterval?:NodeJS.Timeout

/**
 * Sets up a timer to auto-refresh the users auth token
 * This ensures they are not auto logged out every hour
 */
  #setRefreshInterval = <T extends Record<string, any>>(
    params:T
  ) => AppWorker.refreshTimer(ComLink.proxy(this.refresh.bind(this)), params)

  /**
   * Remove the refresh timer within the worker
   */
  clearRefreshTimer = () => {
    AppWorker.clearRefreshTimer()
  }

  /**
   * Makes call to refresh the users Auth JWT
   */
  refresh = async (params:Partial<GitUser>) => {
    try {
      console.log(`Refreshing User Token...`)
      this.clearRefreshTimer()

      const idToken = await getUserToken(true)
      if(!idToken) return await signOutAuthUser()

      const resp = await apiRequest<TValidateResp>({
        url: `${this.authPath}/refresh`,
        method: HttpMethods.POST,
        params: {...params, idToken },
      })

      const {
        jwt,
        user,
      } = await validateResp(resp)

      await localStorage.setJwt(jwt)
      await localStorage.setUser(omitKeys({...params, ...user}, [`token`, `pat`]))

      this.#setRefreshInterval(params)

      return params

    }
    catch(err:any){
      console.error(`[Auth Token Error] Failed to refresh user token.`)
      console.log(err.message)
    }

  }

  validate = async (params:TValidateUserReq, __intervalRefresh?:boolean) => {
    const idToken = await getUserToken(__intervalRefresh)
    // TODO: Look into encrypting the user data to ensure it's not passed on via plain-text
    // While this is a common pattern, would be better to avoid it
    const resp = await apiRequest<TValidateResp>({
      url: `${this.authPath}/validate`,
      method: HttpMethods.POST,
      params: {...params, idToken},
    })

    const {
      jwt,
      user,
      status,
    } = await validateResp(resp)

    // Force token refresh, so the custom claims will be up to date
    params?.pat && await getUserToken(true)
    await localStorage.setJwt(jwt)


    // Remove user token when saving to local storage
    await localStorage.setUser(omitKeys({...params, ...user}, [`token`, `pat`]))
    new GitUser(user as TUserState)

    this.#setRefreshInterval(params)

    return status
  }

  addClaims = async (params:Record<any, any>=emptyObj) => {

    const resp = await apiRequest<TAddClaimsRep>({
      params: {...params},
      method: HttpMethods.POST,
      url: `${this.authPath}/claims/add`,
    })

    if(resp.error || !resp.success)
      throw new Exception(resp.error || `User claims update failed`, resp.statusCode)

    // Force token refresh, so the custom claims will be up to date
    await getUserToken(true)

    // If an updated jwt was returned, ensure it's update to it used moving forward
    resp?.data?.jwt && await localStorage.setJwt(resp?.data?.jwt)

    return resp.data
  }

  removeClaims = async (params:Record<any, any>=emptyObj) => {
    const resp = await apiRequest<TRouteMeta>({
      params,
      method: HttpMethods.POST,
      url: `${this.authPath}/claims/remove`,
    })

    if(resp.error || !resp.success)
      throw new Exception(resp.error || `User claims update failed`, resp.statusCode)

    // Force token refresh, so the custom claims will be up to date
    signOutManually()
  }

}


export const authApi = new AuthApi()
