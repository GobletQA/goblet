import type { TOnAutoChange } from '@gobletqa/components'
import type { TRepoValueCB, TRepoInputError, TBuiltRepo, TBuiltRepos } from '@types'

import { SyncRepos } from './SyncRepos'
import { RepoSelect } from './RepoSelect'
import { RepoCreate } from './RepoCreate'
import { RepoToggle } from './RepoToggle'
import Grid from '@mui/material/Unstable_Grid2'
import { RepoDescription } from './RepoDescription'

export type TRepoProps = Partial<typeof repoProps> & {
  repo?:TBuiltRepo
  repos?:TBuiltRepos
  newRepo?:string
  createRepo:boolean
  description?:string
  onChange?:TOnAutoChange
  inputError:TRepoInputError
  onChangeNewRepo:TRepoValueCB
  onChangeDescription:TRepoValueCB
  onInputError?:(key:string, value?:string) => void
}

const repoProps = {
  name: `repo`,
  required: true,
  label: `Repository`,
  textFieldProps: {
    placeholder: `Select from list...`,
  },
}

export const RepoConnect = (props:TRepoProps) => {
  const {
    repo,
    repos,
    newRepo,
    onChange,
    inputError,
    createRepo,
    description,
    onInputError,
    onChangeNewRepo,
    onChangeDescription,
  } = props

  return (
    <Grid
      xs={12}
      container
      sx={{ alignItems: `center` }}
      className='gb-grid-repo-select'
    >

      <Grid className='gb-grid-repo-select' xs={9} md={11} >
        <RepoSelect
          repo={repo}
          repos={repos}
          onChange={onChange}
          error={inputError?.repo}
        />
      </Grid>
      <Grid className='gb-grid-sync-repos' xs={3} md={1} >
        <SyncRepos />
      </Grid>

      {createRepo ? (
        <>
          <Grid
            xs={12}
            className='gb-grid-repo-name'
          >
            <RepoCreate
              newRepo={newRepo}
              inputError={inputError}
              onInputError={onInputError}
              onChangeNewRepo={onChangeNewRepo}
            />
          </Grid>
          <Grid
            xs={12}
            sx={{ paddingTop: `0px` }}
            className='gb-grid-repo-description'
          >
            <RepoDescription
              description={description}
              onChangeDescription={onChangeDescription}
            />
          </Grid>
        </>
      ) : null}
    </Grid>
  )

}

