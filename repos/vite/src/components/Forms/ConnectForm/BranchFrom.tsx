import type { TRepoInputError } from '@types'
import type { FocusEvent, KeyboardEvent } from 'react'
import type { TOnAutoChange } from '@gobletqa/components'

import { useMemo, useCallback, useEffect, useRef } from 'react'
import { CreateNewBranch } from '@constants'
import { eitherArr, emptyArr } from '@keg-hub/jsutils'
import { AutoInput, Input } from '@gobletqa/components'
import { SubGridParent, SubGrid } from './Connect.styled'

export type TBranchFrom = {
  branch?:string
  newBranch?:string
  disabled?:boolean
  branches?:string[]
  onChange?:TOnAutoChange
  inputError:TRepoInputError
  onChangeNewBranch?:(branch:string) => void
  onInputError?:(key:string, value?:string) => void
}

const parentProps = {
  required: true,
  name: `parent-branch`,
  label: `Parent Branch`,
  textFieldProps: {
    placeholder: `Select a parent branch...`,
  },
  rules: {
    required: `Please select a branch`
  }
}

const childProps = {
  required: true,
  autoFocus: true,
  name: `child-branch`,
  label: `Child Branch`,
  placeholder: `Enter a branch name;  exp: my-new-branch`,
}

export const BranchFrom = (props:TBranchFrom) => {

  const {
    branch,
    disabled,
    branches,
    onChange,
    newBranch,
    inputError,
    onInputError,
    onChangeNewBranch,
    ...rest
  } = props

  const inputRef = useRef<HTMLInputElement>()

  const onInputBlur = useCallback((evt:FocusEvent<HTMLInputElement>) => {
    const value = evt.target.value as string
    
    if(!value?.trim?.()){
      onInputError?.(`newBranch`, `A branch name is required!`)
      inputRef?.current?.focus?.()
      return
    }
    
    newBranch !== value && onChangeNewBranch?.(value)
  }, [
    newBranch,
    onInputError,
    onChangeNewBranch
  ])

  const onKeyDown = useCallback((evt:KeyboardEvent<HTMLInputElement>) => {
    inputError.newBranch
      && onInputError?.(`newBranch`, undefined)

  }, [
    newBranch,
    onInputError,
    inputError.newBranch,
  ])

  useEffect(() => {
    inputRef.current
      && newBranch
      && inputRef.current?.value !== newBranch
      && (inputRef.current.value = newBranch)
  }, [newBranch])

  const options = useMemo(
    () => eitherArr(branches, emptyArr).filter((branch:string) => branch !== CreateNewBranch),
    [branches]
  )

  return (
    <SubGridParent
      rowSpacing={2}
      container={true}
      columnSpacing={2}
      disableEqualOverflow={true}
      className='gb-grid-select-branch'
    >
      <SubGrid className='gb-grid-parent-branch' xs={12} md={6} >
        <AutoInput
          {...parentProps}
          {...rest}
          options={options}
          disabled={disabled}
          onChange={onChange}
          currentValue={branch}
          error={inputError.branch}
          className='branch-parent-dropdown'
        />
      </SubGrid>
      <SubGrid className='gb-grid-child-branch' xs={12} md={6} >
        <Input
          {...childProps}
          labelSide={false}
          disabled={!branch}
          inputRef={inputRef}
          onBlur={onInputBlur}
          onKeyDown={onKeyDown}
          defaultValue={newBranch}
          error={inputError.newBranch}
          className='branch-child-input'
        />
      </SubGrid>
    </SubGridParent>
  )

}