import type { Response, Request } from 'express'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'
import { apiRes, resError } from '@gobletqa/shared/express'

/**
 * Validates the required authentication information exists
 */
export const refresh = async (req:Request, res:Response) => {
  const { refreshToken } = req.body
  const config = req.app.locals.config.server

  // @ts-ignore
  const jwtTokens = validateRefreshToken(config.jwt, req.user, refreshToken)

  return jwtTokens
    ? apiRes(res, jwtTokens, 200)
    : resError(`User session is expired, please sign in`, 401)
}


AsyncRouter.post('/auth/refresh', refresh)