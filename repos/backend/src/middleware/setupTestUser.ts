import type { Request as JWTRequest } from 'express-jwt'
import type { Express, Response, NextFunction } from 'express'

import { getApp, AppRouter } from '@gobletqa/shared/api'

/**
 * Adds a fake auth user to the request
 */
export const setupTestUser = (app?:Express) => {

  app = app || getApp() as Express
  AppRouter.use((req:JWTRequest, res:Response, next:NextFunction) => {
    req.auth = {}
    req.auth.userId = `21`
    req.auth.token = `123456`
    req.auth.subdomain = `26369`

    next()
  })
}

