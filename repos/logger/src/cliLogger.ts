import  type { TCLILogger, TLogColors } from './types'

import './stdio'
import { Logger } from './logger'
import { identity } from './utils/helpers'
import { ENVS } from '@gobletqa/environment'
import { levels, getLevelMethods } from './utils/levels'
import {loggerColorDisabled} from './utils/stripColors'

export const getLoggerColors = ():TLogColors => {
  const noColors = loggerColorDisabled()

  return noColors
    ? Object.keys(Logger.colors).reduce((acc, key) => {
        acc[key] = identity
        return acc
      }, {} as any)
    : Logger.colors
}

export const CliLogger:TCLILogger = Object.assign({
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
  CliLogger as Logger,
}