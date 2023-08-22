import type { JwtPayload } from 'jsonwebtoken'
import type { Request as JWTRequest } from 'express-jwt'

import { generateTokens } from './generateTokens'
import {omitKeys} from '@keg-hub/jsutils/omitKeys'

export const updateToken = (
  req:JWTRequest,
  updates:JwtPayload
) => {

  // Remove everything except the goblet specific values
  const current = omitKeys(req.auth, [
    `iss`,
    `sub`,
    `aud`,
    `exp`,
    `nbf`,
    `iat`,
    `jti`,
  ])

  return generateTokens(
    req.app.locals.config.server.jwt,
    {...current, ...updates}
  )
}