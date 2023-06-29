import type { TGobletConfig } from '../types'

import fs from 'fs'
import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { configFromFolder } from './configFromFolder'

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


/**
 * Loads a goblet.config from a folder path recursively
 */
export const loadConfigFromBase = (base:string) => {
  const {
    GOBLET_CONFIG_BASE,
    GOBLET_RUN_FROM_CI,
  } = process.env

  // Check if running from a CI environment and the GOBLET_CONFIG_BASE is set
  base = base || GOBLET_CONFIG_BASE

  if (!base) return null

  const cleanedDir = path.normalize(base)

  if (!fs.existsSync(cleanedDir)) {
    /**
     * This issue is most likely a race condition 
     * Seems to happen when a repo is amounted 
     * While at the same time something is trying to load the goblet config
     * Can most likely ignore it, but need to investigate further
     */
    Logger.warn(
      [
        `\n`,
        `[ WARNING ] `,
        Logger.colors.red(
          `The base path does not exist on the host file-system\n`
        ),
        Logger.colors.white(`  directory => `),
        Logger.colors.yellow(cleanedDir),
        Logger.colors.white(`  base => `),
        Logger.colors.yellow(base),
        `\n`,
      ].join('')
    )

    // Print the stack trace so we can see how this happened?
    console.trace()

    return null
  }
  
  const stat = fs.lstatSync(cleanedDir)
  const startDir = stat.isDirectory() || (GOBLET_RUN_FROM_CI && stat.isSymbolicLink())
    ? cleanedDir
    : path.dirname(cleanedDir)

  return findConfig(startDir)
}
