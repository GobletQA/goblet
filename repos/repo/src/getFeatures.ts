import type { Repo } from '@GRP/types'

import { getDefinitions } from '@gobletqa/repo/getDefinitions'
import { loadFeatures } from '@gobletqa/shared/libs/features/features'

export const getFeatures = async (repo:Repo) => {
  const {definitions} = await getDefinitions(repo)
  const features = await loadFeatures(repo)
  
  return {
    features,
    definitions,
  }
}
