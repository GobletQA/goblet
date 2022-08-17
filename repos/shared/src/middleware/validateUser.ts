import { resError } from '../express/resError'
import { AppRouter } from '../express/appRouter'
import { asyncWrap } from '../express/asyncWrap'
import type { Express, Request, Response, NextFunction } from 'express'

/**
 * Checks if the user and their token exists in the session.
 * If not, then throws an error
 */
const checkUserInRequest = asyncWrap(async (req:Request, res:Response, next:NextFunction) => {
  // TODO: create a custom user over
  // @ts-ignore
  if (req.user && req.user.userId && req.user.token) return next()

  resError(`User session is expired, please sign in`, 401)
})

/**
 * Checks if server auth is enabled
 * Then adds middleware to validation a users session
 */
export const validateUser = (app:Express, route:string) => {
  app.locals.config.server.auth &&
    AppRouter.use(route, checkUserInRequest)
}
