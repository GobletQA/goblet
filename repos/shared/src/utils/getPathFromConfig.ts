import type { TGobletConfig } from '@GSH/types'

import path from 'path'
import { getGobletConfig } from './getGobletConfig'
import { getRepoGobletDir } from './getRepoGobletDir'

/**
 * First gets the baseDir
 * Next, gets a full path from that base dir based on the passed in key
 */
export const getPathFromConfig = (key:string, config:TGobletConfig) => {
  config = config || getGobletConfig(config)
  const baseDir = getRepoGobletDir(config)

  return path.join(baseDir, config.paths[key])
}

module.exports = {
  getPathFromConfig,
}
