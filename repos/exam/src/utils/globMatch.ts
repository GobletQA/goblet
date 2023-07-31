import type { GlobOptions } from 'glob'

import { glob } from 'glob'
import micromatch from 'micromatch'
import { naturalSort } from './naturalSort'
import { emptyObj, ensureArr } from '@keg-hub/jsutils'
import { GlobFilesCfg } from "@GEX/constants/defaults"
import { GlobMatchKeys } from "@GEX/constants/constants"

export const globMatchFiles = async (
  match:string|string[],
  opts?:GlobOptions
) => {
  const config = {...GlobFilesCfg, ...opts} 
  /**
   * Helper to check if a match contains any glob keys
   * If it does not, assume the they want to do a repo wide search
   * TODO: will want to add a config option to enable / disable this behavior
   */
  const matches = ensureArr<string>(match).map(item => {
    return !GlobMatchKeys.find(key => item.includes(key))
      ? item.includes(`.`)
        ? item.startsWith(`/`)
          // May not want to keep this one, we'll see
          ? `**/+(${item.replace(/^\//, ``)})`
          : `**/+(${item})`
        : `**/+(${item})*`
      : item
  })

  const found = await globFiles(matches, config)

  return naturalSort<string[]>(found)
  
}


export const globMatch = (
  patterns:string|string[],
  globs:string|string[],
  opts:Record<string, any>=emptyObj
) => {
  return micromatch(
    ensureArr<string>(patterns),
    ensureArr<string>(globs),
    opts
  )
}

export const globNotMatch = (
  patterns:string|string[],
  globs:string|string[],
  opts:Record<string, any>=emptyObj
) => {
  return micromatch.not(
    ensureArr<string>(patterns),
    ensureArr<string>(globs),
    opts
  )
}

export const createGlobMatcher = (
  globs:string|string[],
  opts:Record<string, any>=emptyObj
):(match:string)=>boolean => micromatch.matcher(ensureArr<string>(globs), opts)


export const globFiles = async <T=GlobOptions>(
  fileMatch:string|string[],
  opts:T=emptyObj as T
) => {
  const match = ensureArr<string>(fileMatch)
  return await glob(match, opts)
}

export const globKeysMatch = <T extends Record<string, any>=Record<string, any>>(
  obj:T,
  glob:string
):Partial<T> => micromatch.matchKeys(obj, glob)

export const globTypeMatch = <T extends Record<any, any>=Record<any, any>>(
  obj:Record<string, T>,
  glob:string
):T => {
  const matched = globKeysMatch<Record<string, T>>(obj, glob)
  return Object.values(matched).shift()
}

export const findGlobMatch = (
  item:string,
  globs:string[],
  opts:GlobOptions=emptyObj as GlobOptions
) => {
  return globs.find(glob => micromatch.isMatch(item, glob, opts))
}
