import type { TRepoState } from '@types'

import { getStore } from '@store'
import { getFeaturePrefix } from './getFeaturePrefix'
import { addRootToLoc } from '@utils/repo/addRootToLoc'

export const addFeatureToLoc = (key:string, repo?:TRepoState) => {
  repo = repo || getStore().getState().repo
  const featurePrefix = getFeaturePrefix(repo)

  return addRootToLoc(key, featurePrefix)
}