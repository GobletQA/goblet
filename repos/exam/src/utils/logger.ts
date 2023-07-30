import '@GSH/libs/logger/stdio'
import { toBool } from '@keg-hub/jsutils'
import { CliLogger, getLevelLogger } from '@GSH/libs/logger/cliLogger'

const convertEnvToBoolean = (key:string) => {
  const val = process.env[key]
  return (!exists(val) || val === `f`) ? false : toBool(val)
}

const getLogLevel = () => {
  const {
    GB_LOG_LEVEL,
    EXAM_LOG_LEVEL,
    EXAM_CLI_DEBUG,
    EXAM_CLI_VERBOSE,
    GOBLET_TEST_DEBUG,
    GOBLET_TEST_VERBOSE,
  } = process.env
  
  if(EXAM_CLI_DEBUG)
    return convertEnvToBoolean(EXAM_CLI_DEBUG)
      && CliLogger.levels.levels.debug

  if(EXAM_CLI_VERBOSE)
    return convertEnvToBoolean(EXAM_CLI_VERBOSE)
      && CliLogger.levels.levels.verbose

  if(EXAM_LOG_LEVEL)
    return convertEnvToBoolean(EXAM_LOG_LEVEL)
      && CliLogger.levels.levels[EXAM_LOG_LEVEL]

  if(GOBLET_TEST_DEBUG)
    return convertEnvToBoolean(GOBLET_TEST_DEBUG)
      && CliLogger.levels.levels.debug

  if(GOBLET_TEST_VERBOSE)
    return convertEnvToBoolean(GOBLET_TEST_VERBOSE)
      && CliLogger.levels.levels.debug

  if(GB_LOG_LEVEL)
    return convertEnvToBoolean(GB_LOG_LEVEL)
      && CliLogger.levels.levels[GB_LOG_LEVEL]
}

export let _LEVEL:string|number = getLogLevel()

export let Logger = getLevelLogger(_LEVEL)

export const getLogger = (level?:string|number, force?:boolean) => {
  if(!force && Logger) return Logger

  _LEVEL = level || getLogLevel()
  Logger = getLevelLogger(_LEVEL)

  return Logger
}


export {
  CliLogger
}
