import type { Express } from 'express'
import express from 'express'
import { getApp } from '@GSH/express/app'
import { AppRouter } from '@GSH/express/appRouter'

/**
 * Adds json parsing middleware
 * Can cause issues when using a Proxy, so it's configured via a flag
 */
const jsonParsing = (app:Express) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
}

/**
 * Configures the express bodyParser and add the AppRouter to the express app
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
export const setupServer = (app:Express, addAppRouter=true, parseJson=true) => {
  app = app || getApp()

  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  parseJson && jsonParsing(app)

  // Add the express router to the app
  addAppRouter && app.use(AppRouter)
}
