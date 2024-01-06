import type { Response, NextFunction } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { emptyArr } from '@keg-hub/jsutils/emptyArr'
import { resError } from '@GSH/api/express/resError'
import { AppRouter } from '@GSH/api/express/appRouter'
import { isBypassRoute } from '@GSH/utils/isBypassRoute'

export type TMValidateUser = {
  route:string|RegExp,
  bypassRoutes?:Array<string|RegExp>
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
    const { body, auth, originalUrl } = req

    const isValid = Boolean(originalUrl.includes(`container/remove`) && body?.idleSignOut)
      || Boolean(auth && auth.userId && auth.token)
      || isBypassRoute(originalUrl, bypassRoutes)

    isValid
      ? next()
      : resError(`User session is expired, please sign in`, 401)
  })
}

