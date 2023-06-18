import type { JwtPayload } from 'jsonwebtoken'
import type { Request as JWTRequest } from 'express-jwt'
import {generateTokens} from './generateTokens'

export const updateToken = (
  req:JWTRequest,
  updates:JwtPayload
) => {
  return generateTokens(
    req.app.locals.config.server.jwt,
    {...req.auth, ...updates}
  )
}