import type { Repo, TDefGobletConfig } from '@GRP/types'

import { getDefinitions } from '@gobletqa/repo/getDefinitions'
import { loadFeatures } from '@gobletqa/shared/libs/features/features'

export const getFeatures = async (repo:Repo, config:TDefGobletConfig) => {
  const {definitions} = await getDefinitions(repo, config)
  const features = await loadFeatures(repo)
  
  return {
    features,
    definitions,
  }
}
