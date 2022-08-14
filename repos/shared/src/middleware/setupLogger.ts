import { config } from 'winston'
import { Express } from 'express'
import { noOpObj } from '@keg-hub/jsutils'
import expressWinston from 'express-winston'
import { buildLogger } from '../utils/buildLogger'

/**
 * Adds middleware logging for requests
 * @function
 *
 * @return {void}
 */
export const setupLoggerReq = (app:Express, middlewareOpts:Record<any, any>) => {
  const loggerOpts = app.locals.config.logger || noOpObj
  const logger = buildLogger(loggerOpts)
  const logLevel = config.npm.levels[loggerOpts.level || 'info']

  const requestLogger = expressWinston.logger({
    colorize: false,
    expressFormat: true,
    winstonInstance: logger,
    /** Only log the metadata, if the log level is set to at least verbose */
    meta: Boolean(logLevel >= config.npm.levels.verbose),
    /** override options above with passed in options */
    ...(middlewareOpts || noOpObj),
  })

  app.use(requestLogger)

  return requestLogger
}

/**
 * Adds middleware logging for errors
 * @function
 *
 * @return {void}
 */
export const setupLoggerErr = (app:Express, middlewareOpts:Record<any, any>) => {
  const loggerOpts = app.locals.config.logger || noOpObj
  const logger = buildLogger(loggerOpts)
  const logLevel = config.npm.levels[loggerOpts.level || 'info']

  const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
    /** Only log the metadata, if the log level is set to at least verbose */
    meta: Boolean(logLevel >= config.npm.levels.verbose),
    /** override options above with passed in options */
    ...(middlewareOpts || noOpObj),
  })

  app.use(errorLogger)

  return errorLogger
}

