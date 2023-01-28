import type {
  TBuiltRepo,
  TReposState,
  TRepoValueCB,
} from '@types'
import type { Dispatch, SetStateAction } from 'react'
import type { TOnAutoChange } from '@gobletqa/components'

import { useUser } from '@store'
import { CreateNewRepo } from '@constants'
import { useInline } from '@gobletqa/components'
import { formatName } from '@utils/repo/formatName'

export type THRepoEvts = {
  branch?:string
  owner:string
  newRepo:string
  userBranch:string
  createRepo:boolean
  description:string
  apiRepos:TReposState
  repo:TBuiltRepo | undefined
  setOwner:Dispatch<SetStateAction<string>>
  setBranch: Dispatch<SetStateAction<string>>
  setNewRepo:Dispatch<SetStateAction<string>>
  setCreateRepo:Dispatch<SetStateAction<boolean>>
  onInputError?: (key:string, value:string) => void
  setDescription: Dispatch<SetStateAction<string>>
  setRepo: Dispatch<SetStateAction<TBuiltRepo | undefined>>
}

export const useRepoEvents = (props:THRepoEvts) => {

  const {
    repo,
    owner,
    setRepo,
    newRepo,
    setOwner,
    apiRepos,
    setBranch,
    setNewRepo,
    userBranch,
    createRepo,
    description,
    onInputError,
    setCreateRepo,
    setDescription,
  } = props

  
  const onChangeDescription = useInline<TRepoValueCB>((value) => {
    description !== value && setDescription(value)
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

  const user = useUser()
  const onChangeOwner = useInline<TOnAutoChange>((evt, value) => {
    const update = value as string
    update !== owner && setOwner(update)
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

  return {
    onCreateRepo,
    onChangeRepo,
    onChangeOwner,
    onChangeNewRepo,
    onChangeDescription
  }

}
