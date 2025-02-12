import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { authService } from '@GBE/services/firebase'
import { apiRes, resError, AppRouter } from '@gobletqa/shared/api'

/**
 * Remove claims from the user Oauth idToken
 * If the PAT is removed, it will continue to be used until the end of the user session
 */
export const claimsRemove = async (req:JWTRequest, res:Response) => {
  const { claims } = req.body
  const id = req.auth.userId

  ;(!claims || !claims.length)
    && resError(`An array of claims is required`, 400)

  await authService.removeClaims({ id, claims })

  apiRes(res, { message: `User claims removed` }, 200)

}


AppRouter.post(`/auth/claims/remove`, claimsRemove)
