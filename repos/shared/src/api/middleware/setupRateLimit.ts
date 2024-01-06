import type { Express } from 'express'

import { getApp } from '@GSH/api/express/app'
import { rateLimit } from 'express-rate-limit'


/**
 * Sets up Rate limiting based on requests IP
 */
export const setupRateLimit = (app:Express) => {
  app = app || getApp()

  try {
    app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    }))
  }
  catch(err){
    console.warn(`[RateLimit Err] RateLimit middleware through the following error:`)
    console.error(err)
  }

}
