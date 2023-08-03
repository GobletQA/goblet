import  type { TCLILogger, TLogColors } from './logger.types'

import { Logger } from '@keg-hub/cli-utils/logger'
import { identity } from '@keg-hub/jsutils'
import { levels, getLevelMethods } from './levels'

export const loggerColorDisabled = () => {
  const { FORCE_COLOR=`1`, GOBLET_TEST_COLORS=FORCE_COLOR } = process.env
  const noColors = GOBLET_TEST_COLORS === `0`
    || (GOBLET_TEST_COLORS || ``).toLowerCase().startsWith(`f`)

  return noColors
}
 
export const stripColors = (str:string) => {
  return loggerColorDisabled()
    ? str.replace(/\u001b\[.*?m/g, ``).replace(/\x1B\[.*?m/g, ``)
    : str
}

const getLoggerColors = ():TLogColors => {
  const noColors = loggerColorDisabled()

  return noColors
    ? Object.keys(Logger.colors).reduce((acc, key) => {
        acc[key] = identity
        return acc
      }, {} as Record<string, (data:any) => any>)
    : Logger.colors
}

const CliLogger:TCLILogger = {
  ...Logger,
  levels,
  colors: getLoggerColors(),
  level: process.env.GB_LOG_LEVEL || `info`,
}

export const getLevelLogger = (logLevel:string|number):TCLILogger => {
  const level = logLevel || CliLogger.level
  CliLogger.level = logLevel || CliLogger.level

  return Object.assign(CliLogger, getLevelMethods(CliLogger, CliLogger.log)) as TCLILogger
}

export {
  CliLogger,
  getLoggerColors,
  CliLogger as Logger,
}