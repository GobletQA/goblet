import type { TFormattedUser, TRouteMeta, TUserState, TValidateResp } from '@types'

import { HttpMethods } from '@constants'
import { getUserToken } from './providers'
import { GitUser } from '@services/gitUser'
import { apiRequest } from '@utils/api/apiRequest'
import {validateResp} from '@utils/api/validateResp'
import { emptyObj, omitKeys } from '@keg-hub/jsutils'
import { localStorage } from '@services/localStorage'
import { Exception } from '@gobletqa/shared/exceptions/Exception'

export type TAddClaimsRep = {
  jwt?:string
  refresh?:string
}

export class AuthApi {

  authPath = `/auth`

  validate = async (params:TFormattedUser & { pat?:string }) => {
    const idToken = await getUserToken()
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
    await localStorage.setUser(omitKeys(params, [`token`]))
    new GitUser(user as TUserState)

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
