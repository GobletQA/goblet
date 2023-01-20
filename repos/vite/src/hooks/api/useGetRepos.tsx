import type { TOnAutoChange, TBuiltRepos, TBuiltRepo, TReposState } from '@types'

import { useRepos, useUser } from '@store'
import { useInline } from '@gobletqa/components'
import { useEffect, useState, useMemo } from 'react'
import { getRepos } from '@actions/repo/api/getRepos'
import { noOpObj, noPropArr } from '@keg-hub/jsutils'

const useBuildRepos = (repos:TReposState, userBranch:string):TBuiltRepos => {
  return useMemo(() => {
    return !repos || !repos.length
      ? noPropArr
      : repos.map((repo, idx) => {
          return {
            value: idx,
            id: repo.url || repo.name,
            key: repo.url || repo.name,
            label: repo.url || repo.name,
            branches: repo.branches.includes(userBranch)
              ? repo.branches
              : [userBranch, ...repo.branches],
          }
      })
  }, [repos])
}

export type THGetRepos = {
  branch?:string
  repo?:TBuiltRepo
  onInputError?: (key:string, value:string) => void
}


const formatBranchName = (branch:string) => {
  return branch.trim()
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/\s]/gi, `-`)
}

export const useGetRepos = ({
  onInputError,
  repo:initRepo,
  branch:initBranch
}:THGetRepos=noOpObj) => {

  const user = useUser()
  const userBranch = `goblet-${user?.username}`

  const [loading, setLoading] = useState(true)
  const [repo, setRepo] = useState(initRepo)
  const [newBranch, setNewBranch] = useState(``)
  const [branch, setBranch] = useState(initBranch || userBranch)
  
  const apiRepos = useRepos()
  const repos = useBuildRepos(apiRepos, userBranch)

  const onChangeNewBranch = useInline<(branch:string) =>void>((value) => {
    const formatted = formatBranchName(value)
    if(repo?.branches?.includes(formatted))
      return onInputError?.(`newBranch`, `Branch name already exists. Name must be unique.`)

    value !== newBranch
      && setNewBranch(formatBranchName(value))
  })

  const onChangeRepo = useInline<TOnAutoChange>((evt, value) => {
    if(repo && repo.id === value) return

    setRepo(value as TBuiltRepo)
    setBranch(userBranch)
  })

  const onChangeBranch = useInline<TOnAutoChange>((evt, value) => {
    ;(!branch || branch !== value)
      && setBranch(value as string)
  })

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
    branch,
    setRepo,
    newBranch,
    setBranch,
    userBranch,
    onChangeRepo,
    onChangeBranch,
    onChangeNewBranch
  }

}