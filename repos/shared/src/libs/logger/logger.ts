import type { TLogOpts } from '@GSH/utils/buildLogger'

import { buildLogger } from '@GSH/utils/buildLogger'
import { Logger as CliLogger } from '@keg-hub/cli-utils'
import { setLogs, capitalize, isStr, isColl, exists } from '@keg-hub/jsutils'

const { GB_SUB_REPO } = process.env

export type TWLogger = typeof Logger & {
  colors: typeof CliLogger.colors
}

export type TSetupLogger = TLogOpts & {
  tag?:string
  label?:string
}

let __logger:TWLogger
let __logLabel:string= GB_SUB_REPO ? `Goblet ${capitalize(GB_SUB_REPO)}` : `Goblet Logger`

export const setupLogger = ({ tag, label=tag, ...opts }) => {
  if(label) __logLabel = label

  __logger = buildLogger({ label: __logLabel, ...opts }) as TWLogger

  if(!__logger.colors) __logger.colors = CliLogger.colors
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

