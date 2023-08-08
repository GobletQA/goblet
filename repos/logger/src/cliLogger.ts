import  type { TCLILogger, TLogColors } from './logger.types'

import './stdio'
import { Logger } from './logger'
import { identity } from './utils'
import { ENVS } from '@gobletqa/environment'
import { levels, getLevelMethods } from './levels'

export const loggerColorDisabled = () => {
  const noColors = ENVS.GOBLET_TEST_COLORS === `0`
    || (ENVS.GOBLET_TEST_COLORS || ``).toLowerCase().startsWith(`f`)

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
      }, {} as any)
    : Logger.colors
}

const CliLogger:TCLILogger = Object.assign({
  ...Logger,
  levels,
  colors: getLoggerColors(),
})

Object.defineProperty(CliLogger, `level`, {
  get: () => ENVS.GB_LOG_LEVEL || `info`,
  set: (val) => {ENVS.GB_LOG_LEVEL = val}
})


export const getLevelLogger = (logLevel:string|number):TCLILogger => {
  const level = logLevel || CliLogger.level
  if(level !== CliLogger.level) CliLogger.level = level

  return Object.assign(CliLogger, getLevelMethods(CliLogger, CliLogger.log)) as TCLILogger
}

export {
  CliLogger,
  getLoggerColors,
  CliLogger as Logger,
}