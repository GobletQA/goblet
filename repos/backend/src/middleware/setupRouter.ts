import type { Express } from 'express'

import { getApp, AppRouter } from '@gobletqa/shared/api'

/**
 * Adds teh AppRouter to the express application
 */
export const setupRouter = (app?:Express) => {
  app = app || getApp() as Express
  app.use(AppRouter)

  return AppRouter
}