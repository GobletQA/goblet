import type { TRepoInputError, TBuiltRepo } from '@types'
import type { FormEvent } from 'react'
import type { TCreateParams, TConnectParams } from '@hooks/api/useConnectRepo'

import { useUser } from '@store'
import { useState, useCallback } from 'react'
import { useConnectRepo } from '@hooks/api/useConnectRepo'

export type THConnectSubmit = {
  owner:string
  branch:string
  newRepo:string
  loading:boolean
  newBranch:string
  branchFrom:boolean
  description:string
  createRepo:boolean
  repo:TBuiltRepo | undefined
  setLoading:(val:boolean) => void
  onConnect?: (...args:any[]) => void
  setInputError:(val:TRepoInputError) => void
}

export const useSubmit = (props:THConnectSubmit) => {
  const {
    repo,
    owner,
    branch,
    newRepo,
    loading,
    onConnect,
    newBranch,
    setLoading,
    branchFrom,
    createRepo,
    description,
    setInputError
  } = props

  const user = useUser()
  const [formError, setFormError] = useState<string>()

  const onConnectRepo = useConnectRepo({
    loading,
    setLoading,
    setFormError,
  })

  const onSubmit = useCallback(async (event:FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    if(!repo || !branch || (branchFrom && !newBranch) || (createRepo && !newRepo))
      return setInputError({
        repo: !repo ? `A repository is required` : undefined,
        branch: !branch ? `A branch is required` : undefined,
        newBranch: branchFrom && !newBranch ? `A branch name is require` : undefined,
        newRepo: createRepo && !newRepo ? `A repository name is required` : undefined,
      })

    const params:TConnectParams|TCreateParams = {
      repo,
      branch,
      newRepo,
      newBranch,
      createRepo,
      branchFrom,
      description
    }

    if(newRepo && user.username !== owner)
      params.organization = owner

    await onConnectRepo(params)

    onConnect?.(params)
  }, [
    repo,
    owner,
    branch,
    newRepo,
    newBranch,
    createRepo,
    branchFrom,
    description,
    user.username,
  ])
  
  return {
    onSubmit,
    formError,
    setFormError,
    onConnectRepo,
  }

}