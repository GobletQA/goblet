import type { Repo } from '@GRP/types'

import { loadFeatures } from '@gobletqa/shared/fs'
import { getDefinitions } from '@GRP/getDefinitions'

export const getFeatures = async (repo:Repo) => {
  const {definitions} = await getDefinitions(repo)
  const features = await loadFeatures(repo)
  
  return {
    features,
    definitions,
  }
}
