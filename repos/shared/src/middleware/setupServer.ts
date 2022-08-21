import type { Express, Router } from 'express'
import express from 'express'
import { getApp } from '@GSH/express/app'
import { getRouter } from '@GSH/express/appRouter'

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
export const setupServer = (
  app:Express,
  expressRouter?:Router|boolean|string,
  parseJson=true,
  trustProxy:string|number|boolean=1
) => {
  app = app || getApp()

  trustProxy !== false && app.set('trust proxy', 1)
  app.disable('x-powered-by')

  parseJson && jsonParsing(app)

  const router = getRouter(expressRouter)
  router && app.use(router)

}
