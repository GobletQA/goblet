import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import type { TValidateUser } from '@GBE/services/firebase'

import { limbo } from '@keg-hub/jsutils'
import { authService } from '@GBE/services/firebase'
import { apiRes, resError, AppRouter } from '@gobletqa/shared/api'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'

/**
 * Validates the required authentication information exists
 */
export const refresh = async (req:JWTRequest, res:Response) => {
  const { refresh } = req.body

  const [err, validated] = await limbo<TValidateUser>(authService.validate(req.body))
  if(!validated || err) return resError(err?.message ?? `Failed to validate refresh request`, 422)

  const {
    id,
    token,
    hasPAT,
    provider,
    username,
  } = validated

  const config = req.app.locals.config.server

  // **NOTE** The firebase token has allready been refreshed via the frontend, so not needed here
  const updated = validateRefreshToken(config.jwt, {
    ...req.auth,
    id,
    token,
    hasPAT,
    username,
    provider,
  }, refresh)

  return updated
    ? apiRes(res, updated, 200)
    : resError(`Failed to refresh auth token`, 422)

}


AppRouter.post(`/auth/refresh`, refresh)
