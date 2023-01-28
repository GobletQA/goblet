import type {
  TBuiltRepos,
  TReposState,
} from '@types'

import { useMemo } from 'react'
import { CreateNewRepo, CreateNewBranch } from '@constants'

export const useBuildRepos = (
  repos:TReposState,
  userBranch:string,
  username:string
) => {
  return useMemo(() => {
    const parents:string[] = [username]
    const createRepo = {...CreateNewRepo, branches: [CreateNewBranch, userBranch] }
    const emptyRepos = [createRepo]

    const built = !repos || !repos.length
      ? emptyRepos
      : emptyRepos.concat(
          repos.map((repo, idx) => {
            const parent = new URL(repo.url).pathname?.split(`/`)[1]
            parent && !parents.includes(parent) && parents.push(parent)

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
    
    return {
      parents,
      repos: built
    }
  }, [repos])
}
