import type { TRepoState } from '@types'

import { getStore } from '@store'

export const getRootPrefix = (repo?:TRepoState, postfix?:string) => {
  repo = repo || getStore().getState().repo

  const rootPrefix = repo?.paths?.workDir
    ? `${repo?.paths?.repoRoot}/${repo?.paths?.workDir}`
    : repo?.paths?.repoRoot
  
  return postfix
    ? `${rootPrefix}/${postfix.replace(/^\//, '')}`
    : rootPrefix
    
}