
import path from 'path'
import { configFromFolder } from '../loaders/configFromFolder'

/**
 * @description - Searches the file system, from the current working directory
 * upwards to the root directory, for the goblet config
 */
export const findConfig = (startDir?:string) => {
  let currentPath = startDir || process.cwd()
  while (currentPath != '/') {
    const config = configFromFolder(currentPath)
    if (config) return config

    currentPath = path.join(currentPath, '../')
  }
  return null
}

