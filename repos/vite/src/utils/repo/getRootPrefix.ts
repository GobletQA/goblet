import type { TRepoState } from '@types'

import { getStore } from '@store'

export const getRootPrefix = (repo?:TRepoState) => {
  repo = repo || getStore().getState().repo

  return repo?.paths?.workDir
    ? `${repo?.paths?.repoRoot}/${repo?.paths?.workDir}`
    : repo?.paths?.repoRoot
}