import type { TLogOpts } from '@GSH/utils/buildLogger'

import './stdio'
import { buildLogger } from '@GSH/utils/buildLogger'
import { Logger as CliLogger } from '@keg-hub/cli-utils'
import { identity, setLogs, capitalize, isStr, isColl, exists, toBool } from '@keg-hub/jsutils'

const { GB_SUB_REPO } = process.env

export type TWLogger = typeof Logger & {
  colors: typeof CliLogger.colors
}

export type TSetupLogger = Omit<TLogOpts, `label`> & {
  tag?:string
  label?:string
}

let __logger:TWLogger
let __logLabel:string= GB_SUB_REPO ? `Goblet ${capitalize(GB_SUB_REPO)}` : `Goblet Logger`


const getLoggerColors = () => {
  const { GOBLET_TEST_COLORS=`1` } = process.env
  const noColors = GOBLET_TEST_COLORS === `0`
    || (GOBLET_TEST_COLORS || ``).toLowerCase().startsWith(`f`)

  return noColors
    ? Object.keys(CliLogger.colors).reduce((acc, key) => {
        acc[key] = identity
        return acc
      }, {} as Record<string, (data:any) => any>)
    : CliLogger.colors
}

export const setupLogger = ({
  tag,
  label=tag,
  ...opts
}:TSetupLogger) => {
  if(label) __logLabel = label

  __logger = buildLogger({ label: __logLabel, ...opts }) as TWLogger

  if(!__logger.colors) __logger.colors = getLoggerColors()
}

const autoInit = () => {
  if(__logger && __logLabel) return

  setupLogger({ tag: __logLabel, label: __logLabel })
  setLogs(true, `log`, __logLabel)
}

const loggerWrap = (method:string=`info`) => {
  return (...args:any[]) => {
    autoInit()
    const toLog = args.length <= 1 && isStr(args[0])
      ? {
          message: args[0],
          label: __logLabel
        }
      : args.reduce((obj, arg) => {
          if(!exists(arg)) return obj
        
          isColl(arg)
            ? !obj.data ? (obj.data = arg) : (obj.data = [...obj.data, arg])
            : (obj.message = `${obj.message} ${arg}`)

          return obj
        }, { message: ``, label: __logLabel })

    __logger?.[method]?.(toLog)
  }
}


export const Logger = {
  ...CliLogger,
  colors: getLoggerColors(),
  pair: loggerWrap(`info`),
  highlight: loggerWrap(`info`),
  error: loggerWrap(`error`),
  warn: loggerWrap(`warn`),
  data: loggerWrap(`data`),
  log: loggerWrap(`info`),
  info: loggerWrap(`info`),
  debug: loggerWrap(`info`),
  verbose: loggerWrap(`info`),
  silly: loggerWrap(`info`),
  success: loggerWrap(`info`),
}

