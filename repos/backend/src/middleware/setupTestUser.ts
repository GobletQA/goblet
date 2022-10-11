// @ts-nocheck
import type { Express } from 'express'

import { getApp } from '@gobletqa/shared/express/app'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets both app routes
 * Adds the main AppRouter on a subdomain
 * Because that's where the proxy will be applied
 */
export const setupTestUser = (app?:Express) => {

  app = app || getApp() as Express
  AsyncRouter.use((req:Request, res:Response, next:NextFunction) => {
    req.user = {}
    req.user.userId = `21`
    req.user.token = `123456`
    req.user.subdomain = `26369`

    next()
  })
}

