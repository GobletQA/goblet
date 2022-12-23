import type { TGobletConfig } from '@GSH/types'

import path from 'path'
import { getRepoGobletDir } from './getRepoGobletDir'

/**
 * First gets the baseDir
 * Next, gets a full path from that base dir
 */
export const getPathFromBase = (loc:string, config?:TGobletConfig) => {
  const baseDir = getRepoGobletDir(config)

  return path.join(baseDir, loc)
}
