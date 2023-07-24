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