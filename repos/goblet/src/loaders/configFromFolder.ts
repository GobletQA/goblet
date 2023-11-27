import type {
  TCfgFolder,
  TGobletLoader,
  TGobletCfgLoaderResp
} from '../types'

import path from 'path'
import { gobletLoader } from './loader'
import { getGobletCfg } from './configCache'
import { GobletConfigFileLocations } from '../constants'

/**
 * @description - Loops through the possible folder locations
 * and calls configLoader for each one
 */
export const configFromFolder = (baseDir:string, opts:TCfgFolder):TGobletCfgLoaderResp|false => {
  const config = getGobletCfg()
  if(config) return config

  let found:TGobletCfgLoaderResp|false
  for(let idx in GobletConfigFileLocations){
    const loc = GobletConfigFileLocations[idx]
    found = gobletLoader({...opts, basePath: path.join(baseDir, loc)} as TGobletLoader)
    if(found) break
  }

  return found

}

