import path from 'path'
import { fileURLToPath } from 'url'
import { registerAliases } from '../../configs/aliases.config'

registerAliases()

// @ts-ignore
const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Will be needed when the package is bundled
 * Still needs to be figured out
 * So for now just return __dirname
 */
const resolveRoot = () => {
  return __dirname
}

export const GBERoot = resolveRoot()