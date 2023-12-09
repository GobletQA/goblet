import type { Express, NextFunction, Request, Response } from 'express'

import { TLogOpts } from '@GSH/types'
import expressWinston from 'express-winston'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { buildLogger, npmLevels } from '@gobletqa/logger'

export type THandler = (req: Request, res: Response, next: NextFunction) => void

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

}

