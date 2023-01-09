import type { Repo } from './repo'
import type { TDefGobletConfig } from '../types'

import { loadDefinitions } from '@GSH/libs/definitions/definitions'

/**
 * Loads the definitions, then splits them based on their type
 */
export const getDefinitions = async (
  repo:Repo,
  config?:TDefGobletConfig,
  cache:boolean=true
) => {
  const definitions = await loadDefinitions(repo, config as TDefGobletConfig, cache)
  return { definitions }
}
