import type { TExamConfig, TExamCliOpts } from '@GEX/types'

import path from 'path'
import { options } from './options'
import { ENVS } from '@gobletqa/environment'
import { argsParse } from '@keg-hub/args-parse'
import { isArr } from '@keg-hub/jsutils/isArr'
import { isStr } from '@keg-hub/jsutils/isStr'
import { toNum } from '@keg-hub/jsutils/toNum'
import { exists } from '@keg-hub/jsutils/exists'
import { isBool } from '@keg-hub/jsutils/isBool'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { getRoot, homeDir, cwd, setRoot } from './paths'
import { updateLogLevel, Logger } from "@GEX/utils/logger"


const isDevCLI = toNum(process.env.EXAM_DEV_CLI)

/**
 * Resolve the full path to a location similar to path.resolve
 * But can use custom root path values
 */
export const fullLoc = (loc:string, rootDir?:string) => {
  const root = rootDir || getRoot() || cwd

  return loc.startsWith(`/`)
    ? loc
    : loc.startsWith(`~/`)
      ? path.join(homeDir, loc.replace(`~/`, ``))
      : path.join(root, loc)
}


/**
 * Removes the extension from the passed in path location
 */
export const removeExt = (loc:string) => {
  const ext = path.extname(loc)
  if(!ext) return loc
  
  const split = loc.split(ext)
  split.pop()

  return split.join(ext)
}


/**
 * Removes the empty items from the passed Object
 */
export const removeEmpty = <T extends Record<any, any>>(opts:T) => {
  return Object.entries(opts).reduce((acc, [key, value]) => {
    if(!exists(value) || (isArr(value) && !value.length)) return acc

    acc[key as keyof T] = value

    return acc
  }, {} as T)
}


/**
 * Special handling for arguments that can be a boolean or number
 */
const booleanToNum = (opts:TExamCliOpts, key:keyof TExamCliOpts) => {
  const value = opts[key]
  if(!exists(value)) return

  if(isBool(value)) opts[key] = value ? 1 : 0
  else opts[key] = toNum(value)
}
 
/**
 * Parse the cmd line args and clean out empty properties
 */
export const parseArgs = async () => {
  const args = process.argv.slice(2) as string[] 
  const last = args[args.length - 1]

  const opts = await argsParse({ args, task: { options }})
  /**
   * Convert any options that ban be a boolean or number to a number
   * IF false, will be 0; if true, will be 1, or converted into a number
   */
  booleanToNum(opts, `bail`)
  booleanToNum(opts, `testRetry`)
  booleanToNum(opts, `suiteRetry`)

  const cleaned = removeEmpty<TExamCliOpts>(opts)

  updateLoggerLevel(opts, opts.logLevel)

  if(isDevCLI && last.startsWith(`test-file`))
    cleaned.testMatch = [last]

  // If the GOBLET_CONFIG_BASE env is not already set,
  // And the rootDir is set, use it as the config-base
  if(exists(opts.rootDir) && !exists(ENVS.GOBLET_CONFIG_BASE)){
    const resolved = path.resolve(opts.rootDir)
    opts.rootDir = resolved
    ENVS.GOBLET_CONFIG_BASE = resolved

    setRoot(resolved)
  }

  /**
   * Args parse will typically remove empty items but,
   * It also sets empty defaults for Arrays
   * So we loop over and remove those as well
   */
  return cleaned
}

/**
 * Sets updates an env values on the process.env object
 */
const updateEnv = (
  OriginalEnvs:Record<string, any>,
  key:string,
  value:any,
  force?:boolean
) => {
  if(exists(ENVS[key]) && !force) return

  OriginalEnvs[key] = ENVS[key]
  ENVS[key] = isStr(value) ? value : `${JSON.stringify(value)}`
}

/**
 * Updates the log level based on the configured option values
 */
const updateLoggerLevel = (
  opts:Partial<TExamCliOpts|TExamConfig>=emptyObj,
  logLevel=(opts as TExamCliOpts)?.logLevel,
  logCache?:Record<`level`, any>
) => {
  (opts?.debug && updateLogLevel(Logger.levels.levels.debug, logCache))
    || (opts?.verbose && updateLogLevel(Logger.levels.levels.verbose, logCache))
    || (exists(logLevel) && updateLogLevel(logLevel, logCache))
}

/**
 * Updates the ENVs used by the cli once the cli options have been parsed
 */
export const updateCLIEnvs = (
  exam:TExamConfig,
  opts:Partial<TExamCliOpts>=emptyObj,
  force?:boolean
) => {

  let logCache = {} as Record<`level`, any>
  let OriginalEnvs = {} as Record<string, any>

  opts?.env && updateEnv(OriginalEnvs, `EXAM_ENV`, 1, force)
  opts?.env && updateEnv(OriginalEnvs, `NODE_ENV`, opts.env, force)
  opts?.env && updateEnv(OriginalEnvs, `EXAM_CLI_ENV`, opts.env, force)
  opts?.workerId && updateEnv(OriginalEnvs, `EXAM_WORKER_ID`, opts.workerId, force)
  exists(opts?.logLevel) && updateEnv(OriginalEnvs, `EXAM_LOG_LEVEL`, opts?.logLevel, force)

  exists(exam?.debug) && updateEnv(OriginalEnvs, `EXAM_CLI_DEBUG`, opts.debug, force)
  exists(exam?.verbose) && updateEnv(OriginalEnvs, `EXAM_CLI_VERBOSE`, opts.verbose, force)
  
  exam?.mode && updateEnv(OriginalEnvs, `EXAM_CLI_MODE`, exam.mode, force)
  exam?.workers && updateEnv(OriginalEnvs, `EXAM_CLI_WORKERS`, exam.workers, force)
  exam?.concurrency && updateEnv(OriginalEnvs, `EXAM_CLI_CONCURRENCY`, exam.workers, force)

  updateLoggerLevel(exam, opts?.logLevel, logCache)

  return () => {
    Object.entries(OriginalEnvs)
      .forEach(([key, value]) => ENVS[key] = value)
    OriginalEnvs = undefined
    
    logCache?.level && updateLogLevel(logCache.level)
    logCache = undefined
  }

}
