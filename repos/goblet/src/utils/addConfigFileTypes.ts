import type { TGobletConfig } from '../types'

import { exists } from './helpers'
import { getFileTypes } from './getFileTypes'


/**
 * Adds the fileTypes to the config if they don't already exist
 */
export const addConfigFileTypes = (config:TGobletConfig) => {
  if (!config || !config?.paths?.repoRoot || exists(config.fileTypes))
    return config

  // Add the fileTypes if they don't already exist
  config.fileTypes = getFileTypes(config?.paths?.repoRoot, config?.paths)

  return config
}
