import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { resError } from '@gobletqa/shared/api/express/resError'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'
import {authService} from '@GBE/services/firebase'

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

  const updated = validateRefreshToken(config.jwt, {
    ...req.auth,
    id,
    token,
    username,
    provider,
  }, refresh)

  // TODO: Need to also refresh the firebase token via the firebase service

  return updated
    ? apiRes(res, updated, 200)
    : resError(`User session is expired, please sign in`, 401)
}


AppRouter.post(`/auth/refresh`, refresh)
