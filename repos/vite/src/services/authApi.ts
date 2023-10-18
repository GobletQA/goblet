import type { TFormattedUser, TRouteMeta, TUserState, TValidateResp } from '@types'

import { HttpMethods } from '@constants'
import {
  getUserToken,
  autoRefreshUserToken
} from './providers'
import { GitUser } from '@services/gitUser'
import { apiRequest } from '@utils/api/apiRequest'
import { localStorage } from '@services/localStorage'
import { emptyObj, omitKeys } from '@keg-hub/jsutils'
import { validateResp } from '@utils/api/validateResp'
import { Exception } from '@gobletqa/shared/exceptions/Exception'

export type TAddClaimsRep = {
  jwt?:string
  refresh?:string
}

export type TValidateUserReq = TFormattedUser & {
  pat?:string,
  refresh?:boolean
}

export class AuthApi {

  authPath = `/auth`
  refreshTimer?:NodeJS.Timeout

  clearRefreshTimer = () => {
    if(!this.refreshTimer) return

    console.log(`Clear refresh timer...`)
    clearTimeout(this.refreshTimer)

    this.refreshTimer = undefined
  }

  // refresh = async (params:Partial<GitUser>) => {
  //   const idToken = await getUserToken(true)
  //   if(!idToken) return await signOutAuthUser()

  //   const resp = await apiRequest<TValidateResp>({
  //     url: `${this.authPath}/refresh`,
  //     method: HttpMethods.POST,
  //     params: {...params, idToken },
  //   })

  //   const {
  //     jwt,
  //     user,
  //   } = await validateResp(resp)

  //   await localStorage.setJwt(jwt)
  //   await localStorage.setUser(omitKeys({...params, ...user}, [`token`, `pat`]))

  //   if(!this.refreshTimer)
  //     this.refreshTimer = autoRefreshUserToken(this.refresh.bind(this), params)


  //   return params
  // }

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

    // if(!this.refreshTimer)
    //   this.refreshTimer = autoRefreshUserToken(this.validate.bind(this), params)

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
    await getUserToken(true)

    return resp.data
  }

}


export const authApi = new AuthApi()
