import type { TGobletConfig } from '../types'

import path from 'path'
import { gobletLoader } from '@GSH/libs/loader'
import { GobletConfigFileLocations } from '@GSH/constants'

/**
 * @description - Loops through the possible folder locations
 * and calls gobletLoader for each one
 */
export const configFromFolder = (baseDir:string) => {
  return GobletConfigFileLocations.reduce((found:false|TGobletConfig, loc:string) => {
    return found
      || gobletLoader({ basePath: path.join(baseDir, loc) })
      || found
  }, false)
}
