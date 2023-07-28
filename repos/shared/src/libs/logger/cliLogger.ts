import { Logger } from '@keg-hub/cli-utils'
import { identity } from '@keg-hub/jsutils'

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

const getLoggerColors = () => {
  const noColors = loggerColorDisabled()

  return noColors
    ? Object.keys(Logger.colors).reduce((acc, key) => {
        acc[key] = identity
        return acc
      }, {} as Record<string, (data:any) => any>)
    : Logger.colors
}

const CliLogger = {
  ...Logger,
  colors: getLoggerColors(),
}

export {
  CliLogger,
  getLoggerColors,
  CliLogger as Logger,
}