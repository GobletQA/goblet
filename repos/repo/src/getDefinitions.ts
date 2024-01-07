import type { Repo } from '@GRP/types'
import { loadDefinitions } from '@gobletqa/shared/fs'

/**
 * Loads the definitions, then splits them based on their type
 */
export const getDefinitions = async (
  repo:Repo,
  cache:boolean=true
) => {
  const definitions = await loadDefinitions(repo, cache)
  return { definitions }
}
