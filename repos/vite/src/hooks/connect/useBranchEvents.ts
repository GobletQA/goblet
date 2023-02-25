import type {
  TBuiltRepo,
  TRepoValueCB,
} from '@types'
import type { Dispatch, SetStateAction } from 'react'
import type { TOnAutoChange } from '@gobletqa/components'

import { useInline } from '@gobletqa/components'
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
    setNewBranch,
    onInputError,
    setBranchFrom
  } = props

  const onChangeNewBranch = useInline<TRepoValueCB>((value) => {
    const formatted = formatName(value)
    if(repo?.branches?.includes(formatted))
      return onInputError?.(`newBranch`, `Branch name already exists. Name must be unique.`)

    formatted !== newBranch
      && setNewBranch(formatted)
  })

  const onChangeBranch = useInline<TOnAutoChange>((evt, value, reason) => {
    const isCreateBranch = value === CreateNewBranch
    const isCreateBranchSelect = reason === CreateBranchSelect

    if(isCreateBranch || isCreateBranchSelect){
      return isCreateBranch
        ? setBranchFrom(true)
        : isCreateBranchSelect && setBranchFrom(false)
    }

    branch !== value && setBranch(value as string)

  })

  return {
    onChangeBranch,
    onChangeNewBranch
  }

}
