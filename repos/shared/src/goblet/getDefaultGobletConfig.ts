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
import type { TDefGobletConfig } from '../types'

import path from 'path'
import { GSHRoot } from '../../resolveRoot'
import { deepMerge } from '@keg-hub/jsutils'


/**
 * **IMPORTANT**
 * Loads the default goblet.config
 * No other file should import the default goblet config
 * **IMPORTANT**
 */
const defConfig:TDefGobletConfig = require(path.join(
  path.join(GSHRoot, `../../`),
  'configs/goblet.default.config.js'
))

let __DEF_CONFIG:TDefGobletConfig

/**
 * Returns the default goblet config
 * Should not be used for loading repo information
 */
export const getDefaultGobletConfig = () => {
  __DEF_CONFIG = __DEF_CONFIG || deepMerge(defConfig)
  return __DEF_CONFIG
}
