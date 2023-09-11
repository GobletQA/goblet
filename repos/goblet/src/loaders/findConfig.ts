import type { TCfgFolder } from '../types'

import path from 'path'
import { configFromFolder } from './configFromFolder'

/**
 * @description - Searches the file system, from the current working directory
 * upwards to the root directory, for the goblet config
 */
export const findConfig = (startDir:string, opts:TCfgFolder) => {
  let currentPath = startDir

  while (currentPath != '/') {
    const config = configFromFolder(currentPath, opts)
    if (config) return config

    currentPath = path.join(currentPath, '../')
  }
  return null
}

