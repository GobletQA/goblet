import fs from 'fs'
import path from 'path'
import { findConfig } from './findConfig'
import { Logger } from '@gobletqa/logger'
import { ENVS } from '@gobletqa/environment'


/**
 * Loads a goblet.config from a folder path recursively
 */
export const loadConfigFromBase = (base:string) => {

  // Check if running from a CI environment and the GOBLET_CONFIG_BASE is set
  base = base || ENVS.GOBLET_CONFIG_BASE

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
  const startDir = stat.isDirectory() || (ENVS.GOBLET_RUN_FROM_CI && stat.isSymbolicLink())
    ? cleanedDir
    : path.dirname(cleanedDir)

  return findConfig(startDir)
}
