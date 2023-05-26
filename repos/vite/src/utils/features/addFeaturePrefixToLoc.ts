import type { TRepoState } from '@types'

import { getFeaturePrefix } from './getFeaturePrefix'

export const addFeaturePrefixToLoc = (loc:string, repo?:TRepoState) => {
  const featurePrefix = getFeaturePrefix(repo)

  return loc.startsWith(featurePrefix)
    ? loc
    : `${featurePrefix.replace(/$\//, '')}/${loc.replace(/^\//, '')}`
}

