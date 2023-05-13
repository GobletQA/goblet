import type { TRepoState } from '@types'

import { getStore } from '@store'

export const fromRootDir = (loc:string, repo?:TRepoState) => {
  repo = repo || getStore().getState().repo
  const rootDir = repo?.paths?.repoRoot || ``

  return loc.replace(rootDir, '')
}