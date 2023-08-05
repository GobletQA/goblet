import  type { TCLILogger, TLogColors } from './logger.types'

import { identity } from '@keg-hub/jsutils'
import { ENVS } from '@gobletqa/environment'
import { Logger } from '@keg-hub/cli-utils/logger'
import { levels, getLevelMethods } from './levels'
const {
  GB_LOG_LEVEL,
  GOBLET_TEST_COLORS,
} = ENVS

export const loggerColorDisabled = () => {
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
  level: GB_LOG_LEVEL || `info`,
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