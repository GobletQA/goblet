import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { resError } from '@gobletqa/shared/express/resError'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'

/**
 * Validates the required authentication information exists
 */
export const refresh = async (req:JWTRequest, res:Response) => {
  const { refreshToken } = req.body
  const config = req.app.locals.config.server

  const jwtTokens = validateRefreshToken(config.jwt, req.auth, refreshToken)

  return jwtTokens
    ? apiRes(res, jwtTokens, 200)
    : resError(`User session is expired, please sign in`, 401)
}


AsyncRouter.post('/auth/refresh', refresh)