import '@GSH/libs/logger/stdio'
import { exists, toBool } from '@keg-hub/jsutils'
import { CliLogger, getLevelLogger } from '@GSH/libs/logger/cliLogger'
import { ExamLogLevel } from '@GEX/constants/defaults'

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
  
  let foundLevel:string|number = ExamLogLevel

  if(EXAM_CLI_DEBUG && convertEnvToBoolean(EXAM_CLI_DEBUG))
    foundLevel = CliLogger.levels.levels.debug

  if(EXAM_CLI_VERBOSE && convertEnvToBoolean(EXAM_CLI_VERBOSE))
    foundLevel = CliLogger.levels.levels.verbose

  if(EXAM_LOG_LEVEL && convertEnvToBoolean(EXAM_LOG_LEVEL))
    foundLevel = CliLogger.levels.levels[EXAM_LOG_LEVEL]

  if(GOBLET_TEST_DEBUG && convertEnvToBoolean(GOBLET_TEST_DEBUG))
    foundLevel = CliLogger.levels.levels.debug

  if(GOBLET_TEST_VERBOSE && convertEnvToBoolean(GOBLET_TEST_VERBOSE))
    foundLevel = CliLogger.levels.levels.debug

  if(GB_LOG_LEVEL && convertEnvToBoolean(GB_LOG_LEVEL))
    foundLevel = CliLogger.levels.levels[GB_LOG_LEVEL]

  return foundLevel
}

export let _LEVEL:string|number = getLogLevel()
export const Logger = getLevelLogger(_LEVEL)

export const updateLogLevel = (level?:string|number) => {
  Logger.level = level || getLogLevel() || _LEVEL
  return Logger
}


export {
  CliLogger
}
