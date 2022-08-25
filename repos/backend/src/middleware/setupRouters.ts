import type { Express } from 'express'

import { getApp } from '@gobletqa/shared/express/app'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets both app routes
 * Adds the main AppRouter on a subdomain
 * Because that's where the proxy will be applied
 */
export const setupRouters = (app?:Express) => {
  app = app || getApp() as Express
  app.use(AsyncRouter)
}