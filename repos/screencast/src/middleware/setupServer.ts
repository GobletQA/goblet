import type { Express } from 'express'
import express from 'express'

/**
 * Configures the express bodyParser and add the AppRouter to the express app
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
export const setupServer = (app:Express) => {
  app.set(`trust proxy`, 2)
  app.disable(`etag`)
  app.disable(`x-powered-by`)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
}
