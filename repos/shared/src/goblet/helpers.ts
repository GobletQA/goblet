import type { TGobletConfig } from '../types'

import path from 'path'
import { loader } from '@GSH/libs/loader'
import { GobletConfigFileNames, GobletConfigFileLocations } from '@GSH/constants'

/**
 * @description - Tries to find the goblet.config.json file from the passed in basePath
 */
export const configAtPath = (basePath:string) => {
  const config = loader<TGobletConfig>({
    basePath,
    first: true,
    loadArr: GobletConfigFileNames,
  })

  // Ensure the repoRoot path gets set
  config?.paths
    && !config?.paths?.repoRoot
    && (config.paths.repoRoot = basePath)

  return config
}

/**
 * @description - Loops through the possible folder locations
 * and calls configAtPath for each one
 */
export const configFromFolder = (baseDir:string) => {
  return GobletConfigFileLocations.reduce((found:false|TGobletConfig, loc) => (
    found || configAtPath(path.join(baseDir, loc)) || found
  ), false)
}

/**
 * @description - Searches the file system, from the current working directory
 * upwards to the root directory, for the goblet config
 */
export const findConfig = (startDir?:string) => {
  let currentPath = startDir || process.cwd()
  while (currentPath != '/') {
    const foundConfig = configFromFolder(currentPath)
    if (foundConfig) return foundConfig
    currentPath = path.join(currentPath, '../')
  }
  return null
}
