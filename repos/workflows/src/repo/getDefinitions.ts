import type { TRepo, TDefGobletConfig } from '@GWF/types'

import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'

/**
 * Loads the definitions, then splits them based on their type
 */
export const getDefinitions = async (
  repo:TRepo,
  config?:TDefGobletConfig,
  cache:boolean=true
) => {
  const definitions = await loadDefinitions(repo, config as TDefGobletConfig, cache)
  return { definitions }
}
