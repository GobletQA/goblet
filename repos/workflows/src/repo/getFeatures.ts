import type { TRepo, TDefGobletConfig } from '@GWF/types'

import { getDefinitions } from '@GWF/repo/getDefinitions'
import { loadFeatures } from '@gobletqa/shared/libs/features/features'

export const getFeatures = async (repo:TRepo, config:TDefGobletConfig) => {
  const {definitions} = await getDefinitions(repo, config)
  const features = await loadFeatures(repo)
  
  return {
    features,
    definitions,
  }
}
