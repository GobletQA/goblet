import type { TGobletCfgLoaderResp } from '../types'

import { createRequire } from 'module'
import { Logger } from '@gobletqa/logger'

let __RelativeRequire:typeof require=createRequire(__dirname)
let __GOBLET_CONFIG:TGobletCfgLoaderResp

export const resetRequire = (baseLoc:string) => {
  if(!baseLoc) Logger.warn(`Missing base location for cache reset`)
  
  if(!__RelativeRequire) return

  Object.keys(__RelativeRequire.cache).forEach(loc => {
    if(loc.startsWith(baseLoc)){
      require.cache[loc] = undefined
      delete require.cache[loc]
    }
  })
  __RelativeRequire.cache = {}
  __RelativeRequire = undefined
}

export const getRelativeRequire = (loc:string) => {
  if(__RelativeRequire) return __RelativeRequire

  __RelativeRequire = createRequire(loc)

  return __RelativeRequire
}

export const getGobletCfg = () => __GOBLET_CONFIG
export const setGobletCfg = (loaded:TGobletCfgLoaderResp) => {
  __GOBLET_CONFIG = loaded
  return __GOBLET_CONFIG
}

/**
 * Resets the loaded goblet config
 */
export const resetGobletConfig = (baseLoc:string) => {
  if(!baseLoc) Logger.warn(`Missing base location for cache reset`)
  __GOBLET_CONFIG = undefined
  resetRequire(baseLoc)
}
