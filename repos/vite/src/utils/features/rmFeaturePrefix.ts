import type { TRepoState } from '@types'

import { getStore } from '@store'
import { getFeaturePrefix } from './getFeaturePrefix'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'


export const rmFeaturePrefix = (key:string, repo?:TRepoState) => {
  repo = repo || getStore().getState().repo
  const featurePrefix = getFeaturePrefix(repo)

  return rmRootFromLoc(key, featurePrefix)
}