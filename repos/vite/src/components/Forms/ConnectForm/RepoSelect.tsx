import type { TBuiltRepo, TBuiltRepos } from '@types'
import type { TOnAutoChange } from '@gobletqa/components'

import { AutoInput } from '@gobletqa/components'

const repoProps = {
  name: `repo`,
  required: true,
  label: `Repository`,
  textFieldProps: {
    placeholder: `Select from list...`,
  },
}
export type TRepoProps = Partial<typeof repoProps> & {
  error?:string
  repo?:TBuiltRepo
  repos?:TBuiltRepos
  onChange?:TOnAutoChange
}

export const RepoSelect = (props:TRepoProps) => {
  const {
    repo,
    repos,
    onChange,
    ...rest
  } = props

  return (
    <AutoInput
      {...repoProps}
      {...rest}
      onChange={onChange}
      options={repos || []}
      className='repo-select-dropdown'
    />
  )

}

