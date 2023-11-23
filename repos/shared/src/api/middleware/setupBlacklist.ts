import type { Express } from 'express'

import { getApp } from '@GSH/api/express/app'
import { rateLimit } from 'express-rate-limit'

/**
 * Sets up IP blocking via a blacklist
 * Attempts to track suspicious activity and then block that IP from access
 */
export const setupBlacklist = (app:Express) => {
  app = app || getApp()

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }))

}
