import type { Request } from 'express'
import type { TRouteMeta, TBEBodyReq, TBEResp } from '@GBE/types'
import type { TValidateUser } from '@GBE/services/firebase'


import {authService} from '@GBE/services/firebase'
import { hashString } from '@keg-hub/jsutils/hashString'
import { apiRes, AppRouter } from '@gobletqa/shared/api'
import { generateTokens } from '@GBE/utils/generateTokens'


export type TValidateReq = TBEBodyReq<TValidateUser>
export type TValidateResp = {
  id: string;
  jwt: string;
  refresh: string;
  username: string;
  provider: string;
  status:TRouteMeta
}

/**
 * Validates the required authentication information exists
 */
export const validate = async (req:TValidateReq, res:TBEResp<TValidateResp>) => {
  const { conductor } = req.app.locals

  const {
    id,
    token,
    provider,
    username,
  } = await authService.validate(req.body)

  const imageRef = Object.keys(conductor.config.images)[0]

  if(!imageRef) throw new Error(`Conductor config missing Image Reference`)

  if (!id || !username || !token || !provider)
    throw new Error(`Provider metadata is unknown. Please sign in again`)

  const config = req.app.locals.config
  res.locals.subdomain = hashString(`${username}-${config?.conductor?.hashKey}`)

  // Containers are based on the subdomain generated from username
  // It's important that the subdomain exists here
  // Before calling the conductor.status method

  // Next call conductor to spin of a container for the user
  // Add the token we just generated for authorization
  // Add type for status === TRouteMeta
  const status = await conductor.status({
    query: {},
    params: { imageRef },
    body: { ensure: true },
  } as Partial<Request>, res.locals.subdomain)

  // First generate tokens for accessing conductor form the frontend
  const jwtTokens = generateTokens(config.server.jwt, {
    token,
    status,
    userId: id,
    provider: provider,
    username: username,
    subdomain: res.locals.subdomain,
  })


  return apiRes<TValidateResp>(
    res,
    {...jwtTokens, id, username, provider, status },
    200
  )
}


AppRouter.post(`/auth/validate`, validate)
