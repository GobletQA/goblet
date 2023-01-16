import type { Request as JWTRequest } from 'express-jwt'
import type { Response, NextFunction, Router } from 'express'

import { emptyArr } from '@keg-hub/jsutils'
import { resError } from '../express/resError'
import { getRouter } from '../express/appRouter'
import { asyncWrap } from '../express/asyncWrap'

export type TMValidateUser = {
  route:string,
  bypassRoutes?: string[]
  expressRouter?:Router|boolean|string
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
  expressRouter,
  bypassRoutes=emptyArr,
}:TMValidateUser) => {
  const router = getRouter(expressRouter)
  router && router.use(route, checkUserInRequest(bypassRoutes))
}

