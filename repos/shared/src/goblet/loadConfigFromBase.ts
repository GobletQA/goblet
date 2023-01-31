import fs from 'fs'
import path from 'path'
import { findConfig } from './helpers'
import { Logger } from '@keg-hub/cli-utils'


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

    return null
  }
  
  const stat = fs.lstatSync(cleanedDir)
  const startDir = stat.isDirectory() || (GOBLET_RUN_FROM_CI && stat.isSymbolicLink())
    ? cleanedDir
    : path.dirname(cleanedDir)

  return findConfig(startDir)
}
