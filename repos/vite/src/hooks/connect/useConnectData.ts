import type { TBuiltRepo } from '@types'

import { useState, useEffect } from 'react'
import { useRepos, useUser } from '@store'
import { noOpObj } from '@keg-hub/jsutils'
import { useBuildRepos } from './useBuildRepos'
import { getRepos } from '@actions/repo/api/getRepos'

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

  const [repo, setRepo] = useState<TBuiltRepo|undefined>(initRepo)
  const [loading, setLoading] = useState<boolean>(true)
  
  const [owner, setOwner] = useState<string>(user?.username || ``)
  const [newRepo, setNewRepo] = useState<string>(``)
  const [createRepo, setCreateRepo] = useState<boolean>(false)

  const apiRepos = useRepos()
  const { repos, parents } = useBuildRepos(apiRepos, userBranch, user?.username || ``)
  const [description, setDescription] = useState<string>(``)

  const [newBranch, setNewBranch] = useState<string>(``)
  const [branchFrom, setBranchFrom] = useState<boolean>(false)
  const [branch, setBranch] = useState(initBranch || userBranch)

  // On initial load of the component, load the users repos
  useEffect(() => {
    if(initRepo && !repo) setRepo(initRepo)
    if(initBranch && !branch) setBranch(initBranch)
  }, [initRepo, repo, initBranch, branch])

  // On initial load of the component, load the users repos
  useEffect(() => {
    if(!loading) return

    ;(!repos || !repos.length) ? getRepos() : setLoading(false)
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
    branchFrom,
    setLoading,
    setNewRepo,
    userBranch,
    createRepo,
    description,
    setNewBranch,
    setBranchFrom,
    setCreateRepo,
    setDescription,
  }

}