import type { TReposState } from '@types'
import { useEffect, useState, useMemo } from 'react'

import { useRepos, } from '@store'
import { getRepos } from '@actions/repo/api/getRepos'
import { noOpObj, noPropArr } from '@keg-hub/jsutils'

export type TBuiltRepo = {
  value: number,
  key: string
  label: string
  branches: string[]
}
export type TBuiltRepos = TBuiltRepo[]


const useBuildRepos = (repos:TReposState):TBuiltRepos => {
  return useMemo(() => {
    return !repos || !repos.length
      ? noPropArr
      : repos.map((repo, idx) => ({
          value: idx,
          key: repo.url || repo.name,
          label: repo.url || repo.name,
          branches: repo.branches
        }))
  }, [repos])
}

export type THGetRepos = {
  repo?:TBuiltRepo
  branch?:string
}


export const useGetRepos = ({
  repo:initRepo,
  branch:initBranch
}:THGetRepos=noOpObj) => {

  const [loading, setLoading] = useState(true)
  const [repo, setRepo] = useState(initRepo)
  const [branch, setBranch] = useState(initBranch)
  
  const apiRepos = useRepos()
  const repos = useBuildRepos(apiRepos)

  const branches = useMemo(
    () => (repo && repo?.branches) || noPropArr,
    [repo]
  )

  // On initial load of the component, load the users repos
  useEffect(() => {
    if(!loading) return

    ;(!repos || !repos.length) ? getRepos() : setLoading(false)
  }, [repos])


  // On initial load of the component, load the users repos
  useEffect(() => {
    if(initRepo && !repo) setRepo(initRepo)
    if(initBranch && !branch) setBranch(initBranch)
  }, [initRepo, repo, initBranch, branch])

  return {
    repo,
    repos,
    setRepo,
    branch,
    branches,
    setBranch,
  }

}