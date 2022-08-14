import type { Response, Request } from 'express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'
import { asyncWrap, apiRes, resError } from '@gobletqa/shared/express'

/**
 * Validates the required authentication information exists
 */
export const refresh = asyncWrap(async (req:Request, res:Response) => {
  const { refreshToken } = req.body
  const config = req.app.locals.config.server

  // @ts-ignore
  const jwtTokens = validateRefreshToken(config.jwt, req.user, refreshToken)

  return jwtTokens
    ? apiRes(res, jwtTokens, 200)
    : resError(`User session is expired, please sign in`, 401)
})


AppRouter.post('/auth/refresh', refresh)