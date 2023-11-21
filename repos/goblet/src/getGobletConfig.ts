/**
 * Helper to load the goblet.config for a repo
 * Loads the default goblet.config.js
 * Then tries to find configs relative to a config path or base directory
 * After the configs are loaded, it merges them together based on specificity
 * The latter override the former
 *  1. default goblet.config.js
 *  2. --base /custom/folder/containing/<goblet.config>
 *  3. --config /custom/full/path/to/<goblet.config>
 *
 * At some point this should extracted out into it's own module
 * And probably added to keg-cli or in cli-utils
 * The hard-coded values would have to be removed and passed on as arguments
 * But it wouldn't take mush to make this a general tool for finding configs
 *
 */

import { Logger } from '@gobletqa/logger'
import { getGobletCfg } from './loaders/configCache'
import { loadConfigFromBase } from './loaders/loadConfigFromBase'

type TGetGobletConfigArgs = {
  ref?:string,
  base?:string
  warn?: boolean
  local?: boolean
  remote?:string
}

/**
 * Gets the Goblet application config from a number of sources
 */
export const getGobletConfig = (
  argsConfig:TGetGobletConfigArgs = {} as TGetGobletConfigArgs
) => {

  const cachedCfg = getGobletCfg()

  // TODO: Exam sets the EXAM_ENV env
  // If other test runners are added, need to ensure this is updated as well
  if (!Boolean(process.env.EXAM_ENV) && cachedCfg?.config) return cachedCfg?.config

  const { config:baseConfig } = loadConfigFromBase(argsConfig) || {}

  if (!baseConfig && argsConfig.local && argsConfig.warn) {
    Logger.warn(
      `\n[ WARNING ] ${Logger.colors.red("Can't find a goblet.config file")}\n`
    )
    Logger.pair(
      `  * Defaulting to`,
      `"goblet/configs/goblet.default.config.js"`
    )
    Logger.warn(`        * Work will not be saved`)
    Logger.log(`  * To use your own config, either:`)
    Logger.log(`        * Specify a path with "--config <path>"; or `)
    Logger.log(
      `        * Ensure a config exists in your current working directory or above it\n`
    )
  }

  return baseConfig
}
