import type { TOnAutoChange } from '@gobletqa/components'

import { AutoInput } from '@gobletqa/components'

const repoProps = {
  name: `owner`,
  required: true,
  label: `Owner`,
  textFieldProps: {
    placeholder: `Select repository owner from list...`,
  },
}
export type TRepoOwnerProps = Partial<typeof repoProps> & {
  error?:string
  owner?:string
  parents?:string[]
  onChange?:TOnAutoChange
}

export const RepoOwnerSelect = (props:TRepoOwnerProps) => {
  const {
    owner,
    parents,
    onChange,
    ...rest
  } = props

  return (
    <AutoInput
      {...repoProps}
      {...rest}
      onChange={onChange}
      currentValue={owner}
      options={parents || []}
      className='repo-select-dropdown'
    />
  )

}

