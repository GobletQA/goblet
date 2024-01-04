import type { GlobOptions } from 'glob'

import { glob } from 'glob'
import micromatch from 'micromatch'
import { naturalSort } from './naturalSort'

import { flatUnion } from '@keg-hub/jsutils/flatUnion'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { ensureArr } from '@keg-hub/jsutils/ensureArr'
import { GlobMatchKeys } from '@gobletqa/environment/constants'

import { GlobFilesCfg } from "@GEX/constants/defaults"
import {TExamConfig} from '@GEX/types'

export const globMatchFiles = async (
  exam:TExamConfig,
  match:string|string[],
  opts?:GlobOptions,
) => {

  const globs = []
  const config = {...GlobFilesCfg, ...opts}
  
  
  const exts = exam?.matchExtensions
    ? exam?.extensions?.length > 1
      ? `{${(exam?.extensions || []).join(`,`)}}`
      : exam?.extensions.join(``)
    : ``

  flatUnion(ensureArr<string>(match).map(item => item.split(`,`)))
    .forEach(item => {
      /**
      * Helper to check if a match contains any glob keys
      * If it does not, assume the they want to do a repo wide search
      * TODO: will want to add a config option to enable / disable this behavior
      */
      if(GlobMatchKeys.find(key => item.includes(key)))
        return globs.push(item)

      item = item.startsWith(`/`) ? item.replace(/^\//, ``) : item
      const hasSlash = item.includes(`/`)

      globs.push(
        `**/${item}/**${exts}`,
        `**/*${item}*/**/*${exts}`,
        ...(
          hasSlash
            ? [`**/${item}*${exts}`]
            : [`**/+(${item})*${exts}`, `**/?(${item}|*${item}*|**${item}**)${exts}`]
        )
      )
  })

  const found = await globFiles(globs, config)

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
