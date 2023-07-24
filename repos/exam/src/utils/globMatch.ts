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