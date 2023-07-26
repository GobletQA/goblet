import { Logger } from '@keg-hub/cli-utils'
import { identity } from '@keg-hub/jsutils'


const getLoggerColors = () => {
  const { GOBLET_TEST_COLORS=`1` } = process.env
  const noColors = GOBLET_TEST_COLORS === `0`
    || (GOBLET_TEST_COLORS || ``).toLowerCase().startsWith(`f`)

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
  CliLogger as Logger
}