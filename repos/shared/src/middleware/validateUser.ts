import { resError } from '../express/resError'
import { getRouter } from '../express/appRouter'
import { asyncWrap } from '../express/asyncWrap'
import type { Express, Request, Response, NextFunction, Router } from 'express'

export type TMValidateUser = {
  route:string,
  bypassRoutes: string[]
  expressRouter?:Router|boolean|string
}

/**
 * Checks if the user and their token exists in the session.
 * If not, then throws an error
 */
const checkUserInRequest = (bypassRoutes:string[]) => {
  return asyncWrap(async (req:Request, res:Response, next:NextFunction) => {
    // TODO: create a custom user over
    // @ts-ignore
    if (req.auth && req.auth.userId && req.auth.token) return next()

    resError(`User session is expired, please sign in`, 401)
  })
}

/**
 * Checks if server auth is enabled
 * Then adds middleware to validation a users session
 */
export const validateUser = ({
  route,
  bypassRoutes,
  expressRouter
}:TMValidateUser) => {
  const router = getRouter(expressRouter)
  router && router.use(route, checkUserInRequest(bypassRoutes))
}

