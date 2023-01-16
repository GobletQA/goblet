import type { Request as JWTRequest } from 'express-jwt'
import type { Express, Response, NextFunction } from 'express'

import { getApp } from '@gobletqa/shared/express/app'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets both app routes
 * Adds the main AppRouter on a subdomain
 * Because that's where the proxy will be applied
 */
export const setupTestUser = (app?:Express) => {

  app = app || getApp() as Express
  AsyncRouter.use((req:JWTRequest, res:Response, next:NextFunction) => {
    req.auth = {}
    req.auth.userId = `21`
    req.auth.token = `123456`
    req.auth.subdomain = `26369`

    next()
  })
}

