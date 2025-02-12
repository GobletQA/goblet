import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { updateToken } from '@GBE/utils/updateToken'
import { authService } from '@GBE/services/firebase'
import { apiRes, AppRouter } from '@gobletqa/shared/api'


/**
 * Add claims to the user Oauth idToken
 */
export const claimsAdd = async (req:JWTRequest, res:Response) => {
  const claims = req.body
  const id = req.auth.userId
  const provider = req.auth.provider

  await authService.addClaims({id, ...claims}, true)

  /**
   * If the PAT was updated
   * We need to also update the JWT token to it can start being used
   */
  const tokens = claims[provider]
    ? updateToken(req, { token: claims[provider] })
    : emptyObj

  return apiRes(res, tokens, 200)
}


AppRouter.post(`/auth/claims/add`, claimsAdd)
