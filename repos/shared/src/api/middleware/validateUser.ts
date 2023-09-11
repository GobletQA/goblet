import type { Response, NextFunction } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { resError } from '@GSH/api/express/resError'
import { AppRouter } from '@GSH/api/express/appRouter'

export type TMValidateUser = {
  route:string|RegExp,
  bypassRoutes?: string[]
}

/**
 * Checks if server auth is enabled
 * Then adds middleware to validation a users session
 */
export const validateUser = ({
  route,
  bypassRoutes=emptyArr,
}:TMValidateUser) => {

  AppRouter.use(route, async (req:JWTRequest, res:Response, next:NextFunction) => {
    if (bypassRoutes.includes(req.originalUrl) || req.auth && req.auth.userId && req.auth.token)
      return next()

    resError(`User session is expired, please sign in`, 401)
  })
}

