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
import type { TDefGobletConfig, TGobletConfig } from '../types'
import { GSHRoot } from '../../resolveRoot'

import path from 'path'
import { Logger } from '@keg-hub/cli-utils'
import { loadCustomConfig } from './loadCustomConfig'
import { addConfigFileTypes } from './addConfigFileTypes'
import { loadConfigFromBase } from './loadConfigFromBase'
import { isStr, noOpObj, deepMerge } from '@keg-hub/jsutils'

type TGetGobletConfigArgs = {
  base?:string
  config?: string
  warn?: boolean
  local?: boolean
}


// TODO: figure out how to fix this
const defConfig:TGobletConfig = require(path.join(
  path.join(GSHRoot, `../../`),
  'configs/goblet.default.config.js'
))

/**
 * **IMPORTANT**
 * Loads the default goblet.config
 * No other file should import the default goblet config
 * **IMPORTANT**
 */
let __DEF_CONFIG:TDefGobletConfig
let __GOBLET_CONFIG:TGobletConfig

/**
 * Gets the Goblet application config from a number of sources
 */
export const getGobletConfig = (
  argsConfig:TGetGobletConfigArgs = noOpObj as TGetGobletConfigArgs
) => {

  // TODO: Jest sets the JEST_WORKER_ID env
  // If other test runners are added, need to ensure this is updated as well
  if (!Boolean(process.env.JEST_WORKER_ID) && __GOBLET_CONFIG) return __GOBLET_CONFIG

  const baseConfig = loadConfigFromBase(isStr(argsConfig.base) && argsConfig.base)
  const customConfig = loadCustomConfig(argsConfig.config)

  if (!customConfig && argsConfig.local && argsConfig.warn) {
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

  // Load here so it doesn't pull in other files which call loadEnvs
  // The loadEnvs response is cached, so we only want to call it at the right time
  __DEF_CONFIG = __DEF_CONFIG || deepMerge(defConfig)

  __GOBLET_CONFIG = addConfigFileTypes(
    deepMerge(
      __DEF_CONFIG,
      // Base if a folder path, not a config file path
      baseConfig,
      // Comes after baseConfig because it's more specific
      customConfig
    )
  )

  // The default config.internalPaths should never be overwritten
  // So reset it here just in case it was
  __GOBLET_CONFIG.internalPaths = __DEF_CONFIG.internalPaths

  return __GOBLET_CONFIG
}

/**
 * Resets the loaded goblet config
 */
export const resetGobletConfig = () => {
  __GOBLET_CONFIG = undefined
}

/**
 * Returns the default goblet config
 * Should not be used for loading repo information
 */
export const getDefaultGobletConfig = () => {
  __DEF_CONFIG = __DEF_CONFIG || deepMerge(defConfig)
  return __DEF_CONFIG
}
