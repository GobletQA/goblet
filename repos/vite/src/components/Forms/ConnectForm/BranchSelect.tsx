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
  },
  sx: {
    height: `40px`,
    paddingTop: `0px`,
    paddingBottom: `0px`,
    [`& .MuiTextField-root`]: {
      height: `40px`,
    },
    [`& .MuiInputBase-root`]: {
      height: `40px`,
      paddingTop: `0px`,
      paddingBottom: `0px`,
      [`input::placeholder `]: {
        fontSize: `14px`,
      }
    }
  }
}
export type TBranchProps = Partial<typeof branchProps> & {
  branch?:string
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
      options={branches || []}
      className='branch-select-dropdown'
    />
  )
  
}

