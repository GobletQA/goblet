import type { Express } from 'express'
import { AppRouter } from '@gobletqa/shared/api'

/**
 * Adds the AppRouter to the express application
 */
export const setupRouter = (app?:Express) => {
  app.use(AppRouter)

  return AppRouter
}