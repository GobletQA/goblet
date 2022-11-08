import type { Repo } from './repo'

import { loadFeatures } from '@GSH/libs/features/features'
import { getDefinitions } from '@GSH/repo/getDefinitions'

export const getFeatures = async (repo:Repo, config) => {
  const {definitions, definitionTypes} = await getDefinitions(repo, config)
  const features = await loadFeatures(repo)
  
  return {
    features,
    definitions,
    definitionTypes
  }
}
