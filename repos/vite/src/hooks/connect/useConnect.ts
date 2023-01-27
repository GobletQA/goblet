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
    repos,
    branch,
    loading,
    setRepo,
    newRepo,
    apiRepos,
    newBranch,
    setBranch,
    setLoading,
    setNewRepo,
    userBranch,
    createRepo,
    branchFrom,
    description,
    setNewBranch,
    setBranchFrom,
    setCreateRepo,
    setDescription,
  } = useConnectData(props)

  const {
    onCreateRepo,
    onChangeRepo,
    onChangeNewRepo,
    onChangeDescription
  } = useRepoEvents({
    repo,
    setRepo,
    newRepo,
    apiRepos,
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
    repos,
    branch,
    setRepo,
    newRepo,
    loading,
    newBranch,
    setBranch,
    createRepo,
    setLoading,
    branchFrom,
    userBranch,
    description,
    onCreateRepo,
    onChangeRepo,
    setBranchFrom,
    onChangeBranch,
    onChangeNewRepo,
    onChangeNewBranch,
    onChangeDescription,
  }

}