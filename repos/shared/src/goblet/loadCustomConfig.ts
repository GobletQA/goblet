import path from 'path'
import { findConfig } from './helpers'
import { isStr } from '@keg-hub/jsutils'
import { loadFromType } from '@GSH/libs/loader'

/**
 * Loads a custom config from an ENV, or passed in option
 */
export const loadCustomConfig = (
  runtimeConfigPath:string,
  search:boolean = true
) => {
  const configPath = isStr(runtimeConfigPath)
    ? runtimeConfigPath
    : process.env.GOBLET_CONFIG_PATH

  try {
    // Always clear out the node require cache
    // This ensure we get a fresh file every time
    // Otherwise changed files would not get reloaded
    delete require.cache[configPath]

    const customConfig = configPath
      ? require(path.resolve(configPath))
      : search && findConfig()

    return customConfig && loadFromType(customConfig)
  }
  catch (err) {
    if (configPath) throw err

    // if config is not specified by param or env,
    // try finding it at the execution directory
    return search && findConfig()
  }
}
