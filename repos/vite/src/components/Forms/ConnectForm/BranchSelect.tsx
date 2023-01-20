import type { TOnAutoChange } from '@types'

import { AutoInput } from '@components/Form/Inputs/AutoInput'

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
  onChange?:TOnAutoChange
}

export const BranchSelect = (props:TBranchProps) => {
  const {
    branch,
    branches,
    onChange,
    ...rest
  } = props

  return (
    <AutoInput
      {...branchProps}
      {...rest}
      onChange={onChange}
      currentValue={branch}
      options={branches || []}
      className='branch-select-dropdown'
    />
  )
  
}

