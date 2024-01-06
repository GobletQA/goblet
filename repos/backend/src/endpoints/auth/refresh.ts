import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { authService } from '@GBE/services/firebase'
import { apiRes, resError, AppRouter } from '@gobletqa/shared/api'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'

/**
 * Validates the required authentication information exists
 */
export const refresh = async (req:JWTRequest, res:Response) => {
  const { refresh } = req.body

  const {
    id,
    token,
    provider,
    username,
  } = await authService.validate(req.body)


  const config = req.app.locals.config.server

  // **NOTE** The firebase token has all ready been refreshed via the frontend, so not needed here
  const updated = validateRefreshToken(config.jwt, {
    ...req.auth,
    id,
    token,
    username,
    provider,
  }, refresh)

  return updated
    ? apiRes(res, updated, 200)
    : resError(`User session is expired, please sign in`, 401)
}


AppRouter.post(`/auth/refresh`, refresh)
