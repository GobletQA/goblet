import type { Repo, TDefGobletConfig } from '@GRP/types'

import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'

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
