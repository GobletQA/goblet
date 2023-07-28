import type { TExamCliOpts } from '../types/bin.types'

import path from 'path'
import { options } from './options'
import { getRoot, homeDir, cwd } from './paths'
import { argsParse } from '@keg-hub/args-parse'
import { exists, isArr, toNum } from '@keg-hub/jsutils'

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

  if(isDevCLI && last.startsWith(`test-file`))
    cleaned.testMatch = [last]

  /**
   * Args parse will typically remove empty items but,
   * It also sets empty defaults for Arrays
   * So we loop over and remove those as well
   */
  return cleaned
}

