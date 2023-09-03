import type { Request as JWTRequest } from 'express-jwt'
import type { Response, NextFunction, Router } from 'express'

import { resError } from '@GSH/api/express/resError'
import { asyncWrap } from '@GSH/api/express/asyncWrap'
import { emptyArr } from '@keg-hub/jsutils/emptyArr'

export type TMValidateUser = {
  router?:Router
  route:string|RegExp,
  bypassRoutes?: string[]
}

/**
 * Checks if the user and their token exists in the session.
 * If not, then throws an error
 */
const checkUserInRequest = (bypassRoutes:string[]) => {
  return asyncWrap(async (req:JWTRequest, res:Response, next:NextFunction) => {
    if (bypassRoutes.includes(req.originalUrl) || req.auth && req.auth.userId && req.auth.token)
      return next()

    resError(`User session is expired, please sign in`, 401)
  })
}

/**
 * Checks if server auth is enabled
 * Then adds middleware to validation a users session
 */
export const validateUser = ({
  route,
  router,
  bypassRoutes=emptyArr,
}:TMValidateUser) => {
  router && router.use(route, checkUserInRequest(bypassRoutes))
}

