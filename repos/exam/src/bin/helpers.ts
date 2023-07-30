import type { TExamConfig, TExamCliOpts } from '@GEX/types'

import path from 'path'
import { options } from './options'
import { getRoot, homeDir, cwd } from './paths'
import { argsParse } from '@keg-hub/args-parse'
import { updateLogLevel, Logger } from "@GEX/utils/logger"
import { emptyObj, exists, isArr, isBool, isNum, isStr, toNum } from '@keg-hub/jsutils'

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
 * Parse the cmd line args and clean out empty properties
 */
export const parseArgs = async () => {
  const args = process.argv.slice(2) as string[] 
  const last = args[args.length - 1]

  const opts = await argsParse({ args, task: { options }})
  const cleaned = removeEmpty<TExamCliOpts>(opts)

  updateLoggerLevel(opts, opts.logLevel)

  /**
   * Special handling for bail as it can be a boolean or number
   */
  if(exists(opts.bail) && !isBool(opts.bail) && !isNum(opts.bail))
    opts.bail = toNum(opts.bail)

  if(isDevCLI && last.startsWith(`test-file`))
    cleaned.testMatch = [last]

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
const updateEnv = (key:string, value:any, force?:boolean) => {
  if(process.env[key] && !force) return

  process.env[key] = isStr(value) ? value : `${JSON.stringify(value)}`
}

/**
 * Updates the log level based on the configured option values
 */
const updateLoggerLevel = (
  opts:Partial<TExamCliOpts|TExamConfig>=emptyObj,
  logLevel=(opts as TExamCliOpts)?.logLevel
) => {
  (opts?.debug && updateLogLevel(Logger.levels.levels.debug))
    || (opts?.verbose && updateLogLevel(Logger.levels.levels.verbose))
    || (exists(logLevel) && updateLogLevel(logLevel))
}

/**
 * Updates the ENVs used by the cli once the cli options have been parsed
 */
export const updateCLIEnvs = (
  exam:TExamConfig,
  opts:Partial<TExamCliOpts>=emptyObj,
  force?:boolean
) => {

  opts?.env && updateEnv(`NODE_ENV`, opts.env, force)
  opts?.env && updateEnv(`EXAM_CLI_ENV`, opts.env, force)
  opts?.workerId && updateEnv(`EXAM_WORKER_ID`, opts.workerId, force)
  exists(opts?.logLevel) && updateEnv(`EXAM_LOG_LEVEL`, opts?.logLevel, force)

  exam?.debug && updateEnv(`EXAM_CLI_DEBUG`, 1, force)
  exam?.verbose && updateEnv(`EXAM_CLI_VERBOSE`, 1, force)
  
  exam?.mode && updateEnv(`EXAM_CLI_MODE`, exam.mode, force)
  exam?.workers && updateEnv(`EXAM_CLI_WORKERS`, exam.workers, force)
  exam?.concurrency && updateEnv(`EXAM_CLI_CONCURRENCY`, exam.workers, force)

  updateLoggerLevel(exam, opts?.logLevel)
}
