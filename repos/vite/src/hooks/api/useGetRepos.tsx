import type {
  TBuiltRepos,
  TBuiltRepo,
  TReposState,
  TRepoValueCB,
  TOnAutoChange,
} from '@types'

import { CreateNewRepo } from '@constants'
import { useRepos, useUser } from '@store'
import { useInline } from '@gobletqa/components'
import { useEffect, useState, useMemo } from 'react'
import { getRepos } from '@actions/repo/api/getRepos'
import { noOpObj, noPropArr } from '@keg-hub/jsutils'


const useBuildRepos = (repos:TReposState, userBranch:string):TBuiltRepos => {
  return useMemo(() => {
    const createRepo = {...CreateNewRepo, branches: [userBranch] }
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
                  ? repo.branches
                  : [userBranch, ...repo.branches],
              }
          })
        )
  }, [repos])
}

export type THGetRepos = {
  branch?:string
  repo?:TBuiltRepo
  onInputError?: (key:string, value:string) => void
}


const formatName = (branch:string) => {
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

  const [repo, setRepo] = useState(initRepo)
  const [loading, setLoading] = useState(true)

  const [newBranch, setNewBranch] = useState(``)
  const [branch, setBranch] = useState(initBranch || userBranch)
  
  const [newRepo, setNewRepo] = useState(``)
  const [createRepo, setCreateRepo] = useState(false)

  const apiRepos = useRepos()
  const repos = useBuildRepos(apiRepos, userBranch)

  const [description, setDescription] = useState(``)

  const onChangeDescription = useInline<TRepoValueCB>((value) => {
    description !== value && setDescription(description)
  })

  const onCreateRepo = useInline((evt, value:boolean) => {
   value !== createRepo && setCreateRepo(value)
  })

  const onChangeNewRepo = useInline<TRepoValueCB>((value) => {
    const formatted = formatName(value)

    if(apiRepos.filter(apiRepo => apiRepo?.name === formatted).length)
      return onInputError?.(`newRepo`, `Repo name already exists. Name must be unique.`)

    formatted !== newRepo
      && setNewRepo(formatted)
  })

  const onChangeNewBranch = useInline<TRepoValueCB>((value) => {
    const formatted = formatName(value)
    if(repo?.branches?.includes(formatted))
      return onInputError?.(`newBranch`, `Branch name already exists. Name must be unique.`)

    formatted !== newBranch
      && setNewBranch(formatted)
  })

  const onChangeRepo = useInline<TOnAutoChange>((evt, value) => {
    const update = value as TBuiltRepo
    if(repo?.id === update?.id) return

    update?.id === CreateNewRepo?.id
      ? onCreateRepo(evt, true)
      : onCreateRepo(evt, false)

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
    newRepo,
    newBranch,
    setBranch,
    createRepo,
    userBranch,
    description,
    onCreateRepo,
    onChangeRepo,
    onChangeBranch,
    onChangeNewRepo,
    onChangeNewBranch,
    onChangeDescription,
  }

}