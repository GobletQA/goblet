import type { TGobletConfig } from '../types'

import path from 'path'
import { gobletLoader } from './loader'
import { GobletConfigFileLocations } from '../constants'

/**
 * @description - Loops through the possible folder locations
 * and calls configLoader for each one
 */
export const configFromFolder = (baseDir:string) => {
  return GobletConfigFileLocations.reduce((found:false|TGobletConfig, loc:string) => {
    return found
      || gobletLoader({ basePath: path.join(baseDir, loc) })
      || found
  }, false)
}
