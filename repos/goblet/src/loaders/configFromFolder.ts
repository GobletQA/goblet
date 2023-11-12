import type {
  TCfgFolder,
  TGobletConfig,
  TGobletLoader,
  TGobletCfgLoaderResp
} from '../types'

import path from 'path'
import { gobletLoader } from './loader'
import { GobletConfigFileLocations } from '../constants'

/**
 * @description - Loops through the possible folder locations
 * and calls configLoader for each one
 */
export const configFromFolder = (baseDir:string, opts:TCfgFolder):TGobletCfgLoaderResp|false => {
  return GobletConfigFileLocations.reduce((found:false|TGobletConfig, loc:string) => {
    if(found) return found

    return gobletLoader({
      ...opts,
      basePath: path.join(baseDir, loc),
    } as TGobletLoader) || false
  }, false)
}
