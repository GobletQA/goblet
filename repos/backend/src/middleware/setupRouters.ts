import type { Express } from 'express'

import { getApp } from '@gobletqa/shared/api/express/app'
import { AsyncRouter } from '@gobletqa/shared/api/express/appRouter'

/**
 * Adds teh AsyncRouter to the express application
 */
export const setupAsyncRouter = (app?:Express) => {
  app = app || getApp() as Express
  app.use(AsyncRouter)

  return AsyncRouter
}