import type { Repo } from './repo'

import { definitionsByType } from '@GSH/utils/definitionsByType'
import { loadDefinitions } from '@GSH/libs/definitions/definitions'

/**
 * Loads the definitions, then splits them based on their type
 */
export const getDefinitions = async (repo:Repo, config) => {
  const definitions = await loadDefinitions(repo, config)
  const definitionTypes = definitionsByType(definitions)

  return {
    definitions,
    definitionTypes
  }
}
