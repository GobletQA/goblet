import type { Handler } from 'express'

import { Express } from 'express'
import { TLogOpts } from '../types'
import expressWinston from 'express-winston'
import { buildLogger, npmLevels } from '@gobletqa/logger'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'


/**
 * Adds middleware logging for requests
 * @function
 *
 * @return {void}
 */
export const setupLoggerReq = (app:Express, middlewareOpts?:Record<any, any>) => {
  const loggerOpts = (app.locals.config.logger || noOpObj as TLogOpts)
  const logger = buildLogger(loggerOpts as TLogOpts)
  const logLevel = npmLevels[loggerOpts.level || 'info']

  const requestLogger = expressWinston.logger({
    colorize: false,
    expressFormat: true,
    winstonInstance: logger,
    /** Only log the metadata, if the log level is set to at least verbose */
    meta: Boolean(logLevel >= npmLevels.verbose),
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
export const setupLoggerErr = (app:Express, middlewareOpts?:Record<any, any>) => {
  const loggerOpts = (app.locals.config.logger || noOpObj as TLogOpts)
  const logger = buildLogger(loggerOpts)
  const logLevel = npmLevels[loggerOpts.level || 'info']

  const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
    /** Only log the metadata, if the log level is set to at least verbose */
    meta: Boolean(logLevel >= npmLevels.verbose),
    /** override options above with passed in options */
    ...(middlewareOpts || noOpObj),
  })

  app.use(errorLogger)

  return errorLogger
}

