import type { TRepoInputError, TBuiltRepo } from '@types'
import type { FormEvent, MutableRefObject } from 'react'
import type { TCreateParams, TConnectParams } from '@hooks/api/useConnectRepo'

import { useState } from 'react'
import { useInline } from '@gobletqa/components'
import { useInputError } from '@hooks/form/useInputError'
import { useConnectRepo } from '@hooks/api/useConnectRepo'


export type THConnectSubmit = {
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

  const [formError, setFormError] = useState<string>()

  const onConnectRepo = useConnectRepo({
    loading,
    setLoading,
    setFormError,
  })

  const onSubmit = useInline(async (event:FormEvent<HTMLFormElement>) => {
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

    await onConnectRepo(params)

    onConnect?.(params)
  })
  
  return {
    onSubmit,
    formError,
    setFormError,
    onConnectRepo,
  }

}