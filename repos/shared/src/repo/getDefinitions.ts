import type { Repo } from './repo'
import type { TDefGobletConfig, TGobletConfig } from '../types'

import { loadDefinitions } from '@GSH/libs/definitions/definitions'

/**
 * Loads the definitions, then splits them based on their type
 */
export const getDefinitions = async (repo:Repo, config?:TGobletConfig) => {
  const definitions = await loadDefinitions(repo, config as TDefGobletConfig)
  return { definitions }
}
