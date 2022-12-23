import { getApp } from '@GSH/express/app'
import { Logger } from '@keg-hub/cli-utils'
import { get, isNum } from '@keg-hub/jsutils'

/**
 * Log Levels by name and priority
 * @type {Object}
 */
export const logLevelMap = Object.entries({
  none: 0,
  info: 1,
  debug: 2,
  warn: 3,
  error: 4,
}).reduce((acc, [name, priority]) => {
  acc[name] = priority
  acc[priority] = name

  return acc
}, {})

/**
 * Gets the log level defined in the express app config
 */
export const getLogLevel = () => {
  const app = getApp()
  const logType = get(app.locals, 'config.server.logLevel')
  return isNum(logType) ? logType : logLevelMap[logType]
}

/**
 * Logs the massed in messages based on the app configs log level
 * If the apps logLevel is equal or less then the checkLevel, the message will be logged
 */
export const logger = (checkLevel, ...messages) => {
  const logLevel = getLogLevel()

  logLevel && logLevel <= checkLevel && Logger.log(...messages)
}

