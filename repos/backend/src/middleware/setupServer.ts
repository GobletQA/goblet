import type { Express } from 'express'


/**
 * Configures the express bodyParser and add the AppRouter to the express app
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
export const setupServer = (app:Express) => {
  app.disable(`etag`)
  app.disable(`x-powered-by`)
}
