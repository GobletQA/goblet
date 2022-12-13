import { setLogs } from '@keg-hub/jsutils'
import { capitalize, isStr } from '@keg-hub/jsutils'
import { buildLogger } from '@GSH/utils/buildLogger'
import { Logger as CliLogger } from '@keg-hub/cli-utils'

const { GB_SUB_REPO, NODE_ENV } = process.env

export type TWLogger = typeof Logger & {
  colors: typeof CliLogger.colors
}

export type TSetupLogger = {
  tag?:string
  label?:string
  // Add other log options here 
}

let __logger:TWLogger
let __logLabel:string= GB_SUB_REPO ? `Goblet ${capitalize(GB_SUB_REPO)}` : `Goblet Logger`

export const setupLogger = ({ tag, label=tag, ...opts }) => {
  if(label) __logLabel = label

  // __logger = NODE_ENV === `production`
  //   ?  buildLogger({ label: __logLabel, ...opts }) as TWLogger
  //   : CliLogger

  __logger = buildLogger({ label: __logLabel, ...opts }) as TWLogger

  if(!__logger.colors) __logger.colors = CliLogger.colors
}

const autoInit = () => {
  if(__logger && __logLabel) return

  setupLogger({ tag: __logLabel, label: __logLabel })
  setLogs(true, `log`, __logLabel)
}


const loggerWrap = (
  method:string,
  tagColor:string=method,
  inTag?:boolean,
  logColor?:string
) => {
  const extra = inTag ? ` ${capitalize(method)}` : ''

  return (...args:any[]) => {
    autoInit()

    const tag = `[${__logLabel}${extra}]`

    Logger?.setTag?.(tag, tagColor)
    __logger[method](
      ...(
          logColor
            ? args.map((arg:any) => isStr(arg) ? __logger.colors[logColor](arg) : arg)
            : args
        )
    )
    Logger?.removeTag?.()
  }
}


export const Logger = {
  ...CliLogger,
  error: loggerWrap(`error`, `red`, true, `white`),
  warn: loggerWrap(`warn`, `yellow`, true, `white`),
  data: loggerWrap(`data`, `yellow`, true, `white`),
  log: loggerWrap(`info`, `cyan`, false, `white`),
  info: loggerWrap(`info`, `cyan`, false, `white`),
  debug: loggerWrap(`info`, `while`, false, `white`),
  verbose: loggerWrap(`info`, `while`, true, `white`),
  silly: loggerWrap(`info`, `while`, true, `white`),
  success: loggerWrap(`success`, `green`, true, `white`),
}

