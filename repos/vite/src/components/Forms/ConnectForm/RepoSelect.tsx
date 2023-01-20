import type { TOnAutoChange, TBuiltRepo, TBuiltRepos } from '@types'

import { AutoInput } from '@components/Form/Inputs/AutoInput'

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

