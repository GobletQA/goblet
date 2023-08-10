import { ENVS } from '@gobletqa/environment'
import { exists, toBool } from '@keg-hub/jsutils'
import { ExamLogLevel } from '@GEX/constants/defaults'
import { CliLogger, getLevelLogger } from '@gobletqa/logger'

const convertEnvToBoolean = (key:string) => {
  const val = ENVS[key]
  return (!exists(val) || val === `f`) ? false : toBool(val)
}

const getLogLevel = () => {
  let foundLevel:string|number = ExamLogLevel

  if(ENVS.EXAM_CLI_DEBUG)
    foundLevel = CliLogger.levels.levels.debug

  if(ENVS.EXAM_CLI_VERBOSE)
    foundLevel = CliLogger.levels.levels.verbose

  if(exists(ENVS.EXAM_LOG_LEVEL) && convertEnvToBoolean(`EXAM_LOG_LEVEL`))
    foundLevel = CliLogger.levels.levels[ENVS.EXAM_LOG_LEVEL]

  if(ENVS.GOBLET_TEST_DEBUG)
    foundLevel = CliLogger.levels.levels.debug

  if(ENVS.GOBLET_TEST_VERBOSE)
    foundLevel = CliLogger.levels.levels.debug

  if(exists(ENVS.GB_LOG_LEVEL) && convertEnvToBoolean(`GB_LOG_LEVEL`))
    foundLevel = CliLogger.levels.levels[ENVS.GB_LOG_LEVEL]

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
