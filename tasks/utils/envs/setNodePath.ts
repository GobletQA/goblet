import path from 'path'
import { appRoot } from '../../paths'
const gobletNodeMods = path.join(appRoot, 'node_modules')

/**
 * Sets the NODE_PATH env to allow loading node_modules from a custom directory
 * TODO: investigate this further
 * Either this, or symlink goblet/node_modules to /goblet/node_modules
 */
export const setNodePath = (
  env:Record<string, any>={},
  overwrite:boolean,
  location=gobletNodeMods
) => {
  env.NODE_PATH = overwrite ? location : process.env.NODE_PATH || location

  return env
}
