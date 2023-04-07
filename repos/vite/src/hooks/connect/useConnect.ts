import type { TBuiltRepo } from '@types'

import { noOpObj } from '@keg-hub/jsutils'
import { useRepoEvents } from './useRepoEvents'
import { useConnectData } from './useConnectData'
import { useBranchEvents } from './useBranchEvents'

export type THConnect = {
  branch?:string
  repo?:TBuiltRepo
  onInputError?: (key:string, value:string) => void
}

export const useConnect = (props:THConnect=noOpObj) => {

  const { onInputError } = props

  const {
    repo,
    owner,
    repos,
    branch,
    loading,
    setRepo,
    newRepo,
    parents,
    setOwner,
    apiRepos,
    newBranch,
    setBranch,
    reposError,
    setLoading,
    setNewRepo,
    userBranch,
    createRepo,
    branchFrom,
    description,
    onSyncRepos,
    setNewBranch,
    setReposError,
    setBranchFrom,
    setCreateRepo,
    setDescription,
  } = useConnectData(props)

  const {
    onCreateRepo,
    onChangeRepo,
    onChangeOwner,
    onChangeNewRepo,
    onChangeDescription
  } = useRepoEvents({
    repo,
    owner,
    setRepo,
    newRepo,
    apiRepos,
    setOwner,
    setBranch,
    setNewRepo,
    userBranch,
    createRepo,
    description,
    onInputError,
    setCreateRepo,
    setDescription,
  })

  const {
    onChangeBranch,
    onChangeNewBranch
  } = useBranchEvents({
    repo,
    branch,
    setBranch,
    newBranch,
    branchFrom,
    onInputError,
    setNewBranch,
    setBranchFrom,
  })

  return {
    repo,
    owner,
    repos,
    branch,
    setRepo,
    parents,
    newRepo,
    loading,
    newBranch,
    setBranch,
    reposError,
    createRepo,
    setLoading,
    branchFrom,
    userBranch,
    description,
    onSyncRepos,
    onCreateRepo,
    onChangeRepo,
    setReposError,
    setBranchFrom,
    onChangeOwner,
    onChangeBranch,
    onChangeNewRepo,
    onChangeNewBranch,
    onChangeDescription,
  }

}