import type { TGobletCfgLoaderResp } from '../types'
import { createRequire } from 'module'

let __RelativeRequire:typeof require
let __GOBLET_CONFIG:TGobletCfgLoaderResp

export const resetRequire = () => {
  if(!__RelativeRequire) return

  Object.keys(__RelativeRequire.cache).forEach(loc => {
    if(require.cache[loc]) delete require.cache[loc]
  })
  __RelativeRequire.cache = {}
  __RelativeRequire = undefined
}

export const getRelativeRequire = (loc:string) => {
  if(__RelativeRequire) return __RelativeRequire
  __RelativeRequire = createRequire(loc)
  
  return __RelativeRequire
}
export const setRelativeRequire = (reqFunc:typeof require) => __RelativeRequire = reqFunc

export const getGobletCfg = () => __GOBLET_CONFIG
export const setGobletCfg = (loaded:TGobletCfgLoaderResp) => {
  __GOBLET_CONFIG = loaded
  return __GOBLET_CONFIG
}

/**
 * Resets the loaded goblet config
 */
export const resetGobletConfig = () => {
  __GOBLET_CONFIG = undefined
  resetRequire()
}
