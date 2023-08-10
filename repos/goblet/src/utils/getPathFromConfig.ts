import type { TGobletConfig } from '../types'

import path from 'path'
import { getRepoGobletDir } from './getRepoGobletDir'
import { getGobletConfig } from '../getGobletConfig'

/**
 * First gets the baseDir
 * Next, gets a full path from that base dir based on the passed in key
 */
export const getPathFromConfig = (key:string, config?:TGobletConfig) => {
  config = config || getGobletConfig()
  const baseDir = getRepoGobletDir(config)

  return path.join(baseDir, config.paths[key])
}
