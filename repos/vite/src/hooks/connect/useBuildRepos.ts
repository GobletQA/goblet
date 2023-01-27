import type {
  TBuiltRepos,
  TReposState,
} from '@types'

import { useMemo } from 'react'
import { CreateNewRepo, CreateNewBranch } from '@constants'

export const useBuildRepos = (repos:TReposState, userBranch:string):TBuiltRepos => {
  return useMemo(() => {
    const createRepo = {...CreateNewRepo, branches: [CreateNewBranch, userBranch] }
    const emptyRepos = [createRepo]

    return !repos || !repos.length
      ? emptyRepos
      : emptyRepos.concat(
          repos.map((repo, idx) => {
              return {
                value: idx,
                id: repo.url || repo.name,
                key: repo.url || repo.name,
                label: repo.url || repo.name,
                branches: repo.branches.includes(userBranch)
                  ? [CreateNewBranch, ...repo.branches]
                  : [CreateNewBranch, userBranch, ...repo.branches],
              }
          })
        )
  }, [repos])
}
