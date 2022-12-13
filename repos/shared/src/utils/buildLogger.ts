import winston from 'winston'
import { noOpObj } from '@keg-hub/jsutils'
import { safeReplacer } from './safeReplacer'
const { createLogger, transports, format } = winston
const {
  json,
  splat,
  simple,
  combine,
  timestamp,
  prettyPrint,
  label:logLabel,
} = format

let __LOGGER:winston.Logger


export type TLogOpts = winston.LoggerOptions & {
  label:string
}

/**
 * Winston transform helper to filter out OPTIONS requests from the browser 
 */
const filterOptionsReq = () => {
  return format((info) => {
    return info.message.startsWith(`OPTIONS `)
      ? null
      : info
  })()

}

const getFormatter = (label:string) => {
  return process.env.NODE_ENV !== 'production'
    ? combine(
        filterOptionsReq(),
        timestamp(),
        logLabel({ label }),
        simple(),
        json({ replacer: safeReplacer }),
        prettyPrint({ colorize: true })
      )
    : combine(
        filterOptionsReq(),
        splat(),
        timestamp(),
        logLabel({ label }),
        json({ replacer: safeReplacer })
      )
}

export const buildLogger = (
  options:TLogOpts=noOpObj as TLogOpts,
  defaultLogger:boolean=true
) => {
  if(defaultLogger && __LOGGER) return __LOGGER

  const {
    silent=false,
    level=`info`,
    label=`Goblet`,
    exitOnError=false,
    handleExceptions=true,
  } = options

  const logger = createLogger({
    silent: silent,
    exitOnError: exitOnError,
    transports: [
      new transports.Console({
        level: level,
        format: getFormatter(label),
        handleExceptions: handleExceptions,
      }),
    ],
  })

  if(!defaultLogger) return logger

  __LOGGER = logger
  return __LOGGER
}
