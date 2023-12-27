import type { TBuiltRepo } from '@types'

import { useRepos, useUser } from '@store'
import { ife } from '@keg-hub/jsutils/ife'
import { useBuildRepos } from './useBuildRepos'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { getRepos } from '@actions/repo/api/getRepos'
import { useState, useEffect, useCallback } from 'react'

export type THConnectData = {
  branch?:string
  repo?:TBuiltRepo
}

export const useConnectData = ({
  repo:initRepo,
  branch:initBranch
}:THConnectData=noOpObj) => {

  const user = useUser()
  const userBranch = `goblet-${user?.username}`

  const [reposError, setReposError] = useState<string|undefined>()
  const [repo, setRepo] = useState<TBuiltRepo|undefined>(initRepo)
  const [loading, setLoading] = useState<boolean>(true)
  
  const [owner, setOwner] = useState<string>(user?.username || ``)
  const [newRepo, setNewRepo] = useState<string>(``)
  const [createRepo, setCreateRepo] = useState<boolean>(false)

  const apiRepos = useRepos()
  const hasRepos = Boolean(apiRepos.length)
  
  const { repos, parents } = useBuildRepos(apiRepos, userBranch, user?.username || ``)
  const [description, setDescription] = useState<string>(``)

  const [newBranch, setNewBranch] = useState<string>(``)
  const [branchFrom, setBranchFrom] = useState<boolean>(false)
  const [branch, setBranch] = useState(initBranch || userBranch)

  const onSyncRepos = useCallback(async () => {
    setLoading(true)
    setReposError(undefined)

    await getRepos((errorMsg:string) => {
      setLoading(false)
      setReposError(errorMsg)
    })

    setLoading(false)
  }, [])

  // On initial load of the component, set initial repo and branches
  useEffect(() => {
    if(initRepo && !repo) setRepo(initRepo)
    if(initBranch && !branch) setBranch(initBranch)
  }, [initRepo, repo, initBranch, branch])

  // On initial load of the component, load the users repos
  useEffect(() => {
    if(!loading) return

    !hasRepos
      ? ife(async () => await getRepos((errorMsg:string) => {
          setLoading(false)
          setReposError(errorMsg)
        }))
      : ife(() => {
          setLoading(false)
          setReposError(undefined)
        })

  }, [repos])

  return {
    repo,
    owner,
    repos,
    branch,
    parents,
    loading,
    setRepo,
    newRepo,
    setOwner,
    apiRepos,
    newBranch,
    setBranch,
    reposError,
    branchFrom,
    setLoading,
    setNewRepo,
    userBranch,
    createRepo,
    onSyncRepos,
    description,
    setNewBranch,
    setReposError,
    setBranchFrom,
    setCreateRepo,
    setDescription,
  }

}