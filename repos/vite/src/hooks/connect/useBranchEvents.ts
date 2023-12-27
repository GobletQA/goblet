import type {
  TBuiltRepo,
  TRepoValueCB,
} from '@types'
import type { Dispatch, SetStateAction } from 'react'
import type { TOnAutoChange } from '@gobletqa/components'

import { useCallback } from 'react'
import { formatName } from '@utils/repo/formatName'
import { CreateNewBranch, CreateBranchSelect } from '@constants'

export type THBranchEvts = {
  branch?:string
  repo?:TBuiltRepo
  newBranch:string
  branchFrom:boolean
  setBranchFrom:(val:boolean) => void
  setBranch:Dispatch<SetStateAction<string>>
  setNewBranch: Dispatch<SetStateAction<string>>
  onInputError?: (key:string, value:string) => void
}

export const useBranchEvents = (props:THBranchEvts) => {
  const {
    repo,
    branch,
    setBranch,
    newBranch,
    branchFrom,
    setNewBranch,
    onInputError,
    setBranchFrom
  } = props

  const onChangeNewBranch = useCallback<TRepoValueCB>((value) => {
    const formatted = formatName(value)
    if(repo?.branches?.includes(formatted))
      return onInputError?.(`newBranch`, `Branch name already exists. Name must be unique.`)

    formatted !== newBranch
      && setNewBranch(formatted)
  }, [
    repo,
    newBranch,
    setNewBranch,
  ])

  const onChangeBranch = useCallback<TOnAutoChange>((evt, value, reason) => {
    const isCreateBranch = value === CreateNewBranch
    const isCreateBranchSelect = reason === CreateBranchSelect

    if(isCreateBranch || isCreateBranchSelect){
      return isCreateBranch
        ? setBranchFrom(true)
        : isCreateBranchSelect && setBranchFrom(false)
    }

    branch !== value && setBranch(value as string)

  }, [
    branch,
    branchFrom,
    setBranchFrom
  ])

  return {
    onChangeBranch,
    onChangeNewBranch
  }

}
