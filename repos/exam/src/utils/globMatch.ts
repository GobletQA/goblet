import type { GlobOptions } from 'glob'

import { glob } from 'glob'
import micromatch from 'micromatch'
import { emptyObj, ensureArr } from '@keg-hub/jsutils'

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
  return await glob(ensureArr<string>(fileMatch), opts)
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