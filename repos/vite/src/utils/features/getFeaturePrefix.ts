import type { TRepoState } from '@types'

import { getStore } from '@store'
import { getRootPrefix } from '@utils/repo/getRootPrefix'

export const getFeaturePrefix = (repo?:TRepoState) => {
  repo = repo || getStore().getState().repo

  return getRootPrefix(repo, repo?.paths?.featuresDir)
}
