import type { Repo } from './repo'
import type { TDefGobletConfig } from '../types'

import { loadFeatures } from '@GSH/libs/features/features'
import { getDefinitions } from '@GSH/repo/getDefinitions'

export const getFeatures = async (repo:Repo, config:TDefGobletConfig) => {
  const {definitions} = await getDefinitions(repo, config)
  const features = await loadFeatures(repo)
  
  return {
    features,
    definitions,
  }
}
