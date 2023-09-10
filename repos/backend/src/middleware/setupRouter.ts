import type { Express } from 'express'

import { getApp } from '@gobletqa/shared/api/express/app'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Adds teh AppRouter to the express application
 */
export const setupRouter = (app?:Express) => {
  app = app || getApp() as Express
  app.use(AppRouter)

  return AppRouter
}