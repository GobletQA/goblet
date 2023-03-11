import type { FocusEvent, KeyboardEvent } from 'react'
import type { TRepoValueCB, TRepoInputError } from '@types'

import { useCallback, useEffect, useRef } from 'react'
import { Input } from '@gobletqa/components/components/Form/Inputs'


export type TBranchFrom = {
  newRepo?:string
  inputError:TRepoInputError
  onChangeNewRepo?:TRepoValueCB
  onInputError?:(key:string, value?:string) => void
}

const repoNameProps = {
  required: true,
  autoFocus: true,
  label: `Repo Name`,
  name: `new-repo-name`,
  className: `new-repo-input`,
  placeholder: `Enter a name for the repository;  exp: my-new-repo`,
}

export const RepoCreate = (props:TBranchFrom) => {
  
  const {
    newRepo,
    inputError,
    onInputError,
    onChangeNewRepo,
    ...rest
  } = props

  const inputRef = useRef<HTMLInputElement>()

  const onInputBlur = useCallback((evt:FocusEvent<HTMLInputElement>) => {
    const value = evt.target.value as string

    if(!value?.trim?.()){
      onInputError?.(`newRepo`, `A repository name is required!`)
      inputRef?.current?.focus?.()
      return
    }

    newRepo?.trim?.() !== value?.trim?.()
      && onChangeNewRepo?.(value)
  }, [newRepo])


  const onKeyDown = useCallback((evt:KeyboardEvent<HTMLInputElement>) => {
    inputError.newRepo
      && onInputError?.(`newRepo`, undefined)

  }, [inputError.newRepo, newRepo])

  useEffect(() => {
    inputRef.current
      && newRepo
      && inputRef.current?.value !== newRepo
      && (inputRef.current.value = newRepo)
  }, [newRepo])

  return (
    <Input
      {...repoNameProps}
      defaultValue={newRepo}
      inputRef={inputRef}
      onBlur={onInputBlur}
      onKeyDown={onKeyDown}
      error={inputError.newRepo}
    />
  )
  
}