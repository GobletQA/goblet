import type { Express } from 'express'
import cookieSession from 'cookie-session'
import { exists } from '@keg-hub/jsutils'

/**
 * Sets up a cookie that will be stored client side
 * Will automatically expire at the end of a session or in 12hrs
 */
const setupCookie = (app:Express) => {
  const config = app.locals.config.server
  const {
    key,
    name,
    maxAge,
    secure,
    expires,
    sameSite,
    httpOnly,
    overwrite,
    secret=key,
} = config.cookie

  const cookieConf = {
    name,
    maxAge,
    httpOnly,
    overwrite,
    sameSite,
    ...(exists(maxAge) && {maxAge}),
    ...(exists(secure) && {secure}),
    ...(exists(secret) && {secret}),
    ...(exists(key) && {keys: [key]}),
    ...(exists(expires) && {expires}),
  }

  /**
   * Sets up a cookie that will be stored client side
   * Will automatically expire at the end of a session or in 12hrs
   */
  app.locals.config.server.auth &&
    app.use(cookieSession(cookieConf))
}

module.exports = {
  setupCookie,
}
