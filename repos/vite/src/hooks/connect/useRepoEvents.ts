import type {
  TBuiltRepo,
  TReposState,
  TRepoValueCB,
} from '@types'
import type { Dispatch, SetStateAction } from 'react'
import type { TOnAutoChange } from '@gobletqa/components'


import { useCallback } from 'react'
import { isStr, isUrl } from '@keg-hub/jsutils'
import { formatName } from '@utils/repo/formatName'
import { CreateNewRepo, CreateNewBranch } from '@constants'

export type THRepoEvts = {
  branch?:string
  owner:string
  newRepo:string
  repos:TBuiltRepo[]
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

const formatCustomUrl = (
  value:string,
  userBranch:string
) => {
  const cleaned = value.trim().replace(/\.git$/, ``)
  
  return isUrl(cleaned)
    && {
        id: cleaned,
        key: cleaned,
        label: cleaned,
        value: cleaned,
        branches: [
          userBranch,
          CreateNewBranch,
        ],
      }
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

  
  const onChangeDescription = useCallback<TRepoValueCB>((value) => {
    description !== value && setDescription(value)
  }, [description])

  const onCreateRepo = useCallback((evt:any, value:boolean) => {
   value !== createRepo && setCreateRepo(value)
  }, [createRepo, setCreateRepo])

  const onChangeNewRepo = useCallback<TRepoValueCB>((value) => {
    const formatted = formatName(value)

    if(apiRepos.filter(apiRepo => apiRepo?.name === formatted).length)
      return onInputError?.(`newRepo`, `Repo name already exists. Name must be unique.`)

    formatted !== newRepo
      && setNewRepo(formatted)
  }, [
    newRepo,
    apiRepos,
  ])

  const onChangeOwner = useCallback<TOnAutoChange>((evt, value) => {
    const update = value as string
    update !== owner && setOwner(update)
  }, [owner, setOwner])

  const onChangeRepo = useCallback<TOnAutoChange>((evt, value) => {
    const update = isStr(value)
      ? formatCustomUrl(value, userBranch)
      : value as TBuiltRepo

    if(!update){
      setRepo(undefined)
      setBranch(userBranch)
      return
    }

    if(repo?.id === update?.id) return

    update?.id === CreateNewRepo?.id
      ? onCreateRepo(evt, true)
      : onCreateRepo(evt, false)

    setRepo(update as TBuiltRepo)
    setBranch(userBranch)
  }, [
    repo,
    userBranch,
  ])

  return {
    onCreateRepo,
    onChangeRepo,
    onChangeOwner,
    onChangeNewRepo,
    onChangeDescription
  }

}
