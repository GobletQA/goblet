const winston = require('winston')
const { noOpObj } = require('@keg-hub/jsutils')
const { safeReplacer } = require('./safeReplacer')
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

let __LOGGER


/**
 * Winston transform helper to filter out OPTIONS requests from the browser 
 */
const filterOptionsReq = () => {
  format.transform = (info) => {
    return info.message.startsWith(`OPTIONS `)
      ? null
      : info
  }

  return format
}

const getFormatter = (label) => {
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

const buildLogger = (options=noOpObj, defaultLogger=true) => {
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


module.exports = {
  buildLogger
}