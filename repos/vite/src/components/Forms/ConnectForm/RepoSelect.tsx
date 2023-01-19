import type { ComponentProps } from 'react'
import type { TBuiltRepo, TBuiltRepos } from '@hooks/api/useGetRepos'

import { AutoInput } from '@components/Form/Inputs/AutoInput'

const repoProps = {
  name: `repo`,
  required: true,
  label: `Repository`,
  textFieldProps: {
    placeholder: `Select repository...`,
  },
  rules: {
    required: `Please select a repository`
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
export type TRepoProps = Partial<typeof repoProps> & {
  repo?:TBuiltRepo
  repos?:TBuiltRepos
  onChange?:(repo:TBuiltRepo) => void
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
      options={repos || []}
      className='repo-select-dropdown'
    />
  )
  
}

