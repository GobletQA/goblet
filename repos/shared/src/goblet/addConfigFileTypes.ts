import type { TGobletConfig } from '../types'

import { getFileTypes } from '../utils/getFileTypes'
import { exists } from '@keg-hub/jsutils'


/**
 * Adds the fileTypes to the config if they don't already exist
 * @param {Object} config - Goblet config or RepoClass instance
 *
 * @return {Object} - Config with the fileTypes added
 */
export const addConfigFileTypes = (config:TGobletConfig) => {
  if (!config || !config?.paths?.repoRoot || exists(config.fileTypes))
    return config

  // Add the fileTypes if they don't already exist
  config.fileTypes = getFileTypes(config?.paths?.repoRoot, config?.paths)

  return config
}
