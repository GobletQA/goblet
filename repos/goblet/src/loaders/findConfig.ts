import type { TGobletCfgLoaderResp, TCfgFolder } from '../types'

import path from 'path'
import { configFromFolder } from './configFromFolder'

/**
 * @description - Searches the file system, from the current working directory
 * upwards to the root directory, for the goblet config
 */
export const findConfig = (startDir:string, opts:TCfgFolder) => {
  let currentPath = startDir
  let config:TGobletCfgLoaderResp|false|null = null

  while (currentPath != `/`) {
    config = configFromFolder(currentPath, opts)
    if (config) break

    currentPath = path.join(currentPath, `../`)
  }

  return config
}

