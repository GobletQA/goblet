import type { TOnAutoChange } from '@gobletqa/components'

import { useCallback } from 'react'
import { CreateBranchSelect } from '@constants'
import { AutoInput } from '@gobletqa/components'

const branchProps = {
  name: `branch`,
  required: true,
  label: `Branch`,
  textFieldProps: {
    placeholder: `Select branch...`,
  },
  rules: {
    required: `Please select a branch`
  }
}
export type TBranchProps = Partial<typeof branchProps> & {
  branch?:string
  error?:string
  disabled?:boolean
  branches?:string[]
  branchFrom?:boolean
  onChange?:TOnAutoChange
}

export const BranchSelect = (props:TBranchProps) => {
  const {
    branch,
    branches,
    onChange,
    branchFrom,
    ...rest
  } = props

  const onSelect = useCallback<TOnAutoChange>((evt, val) => {
    onChange?.(evt, val, branchFrom ? CreateBranchSelect : undefined)
  }, [onChange, branchFrom])

  return (
    <AutoInput
      {...branchProps}
      {...rest}
      onChange={onSelect}
      currentValue={branch}
      options={branches || []}
      className='branch-select-dropdown'
    />
  )
  
}

