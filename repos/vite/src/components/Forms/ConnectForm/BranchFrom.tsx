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

  const onInputBlur = useCallback((evt:FocusEvent<HTMLInputElement>) => {
    const value = evt.target.value as string
    newBranch !== value && onChangeNewBranch?.(value)
  }, [newBranch])

  const onKeyDown = useCallback((evt:KeyboardEvent<HTMLInputElement>) => {
    inputError.newBranch
      && onInputError?.(`newBranch`, undefined)

    evt.keyCode === 13
      && inputRef.current?.blur?.()
  }, [inputError.newBranch, newBranch])

  const inputRef = useRef<HTMLInputElement>()

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
          defaultValue={newBranch}
          inputProps={{
            onBlur: onInputBlur,
            onKeyDown: onKeyDown
          }}
          disabled={!branch}
          inputRef={inputRef}
          error={inputError.newBranch}
          className='branch-child-input'
        />
      </SubGrid>
    </SubGridParent>
  )

}