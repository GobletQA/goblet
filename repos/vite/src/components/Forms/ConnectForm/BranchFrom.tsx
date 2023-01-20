import type { TOnAutoChange } from '@types'
import type { TInputError } from './ConnectForm'
import type { FocusEvent, KeyboardEvent, ChangeEvent } from 'react'

import { useCallback, useEffect, useRef } from 'react'
import { Input } from '@components/Form/Inputs/Input'
import { SubGridParent, SubGrid } from './Connect.styled'
import { AutoInput } from '@components/Form/Inputs/AutoInput'


export type TBranchFrom = {
  branch?:string
  newBranch?:string
  disabled?:boolean
  branches?:string[]
  inputError:TInputError
  onChange?:TOnAutoChange
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
    
    console.log(`------- value -------`)
    console.log(value)
    
    newBranch !== value && onChangeNewBranch?.(value)
  }, [newBranch])


  const onKeyDown = useCallback((evt:KeyboardEvent<HTMLInputElement>) => {
    inputError.newBranch
      && onInputError?.(`newBranch`, undefined)
  }, [inputError.newBranch, newBranch])

  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current
      && newBranch
      && inputRef.current?.value !== newBranch
      && (inputRef.current.value = newBranch)
  }, [newBranch])

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
          disabled={disabled}
          onChange={onChange}
          currentValue={branch}
          options={branches || []}
          error={inputError.branch}
          className='branch-parent-dropdown'
        />
      </SubGrid>
      <SubGrid className='gb-grid-child-branch' xs={12} md={6} >
        <Input
          {...childProps}
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