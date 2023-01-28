import type { TOnAutoChange } from '@gobletqa/components'
import type { TRepoValueCB, TRepoInputError, TBuiltRepo, TBuiltRepos } from '@types'

import { SyncRepos } from './SyncRepos'
import { RepoSelect } from './RepoSelect'
import { RepoCreate } from './RepoCreate'
import Grid from '@mui/material/Unstable_Grid2'

export type TRepoProps = Partial<typeof repoProps> & {
  repo?:TBuiltRepo
  repos?:TBuiltRepos
  newRepo?:string
  createRepo:boolean
  onChange?:TOnAutoChange
  inputError:TRepoInputError
  onChangeNewRepo:TRepoValueCB
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

const styles = {
  sync: { paddingTop: `3px` },
  name: { paddingTop: `0px` },
  description: { paddingTop: `0px` },
  container: { alignItems: `center` },
}

export const RepoConnect = (props:TRepoProps) => {
  const {
    repo,
    repos,
    newRepo,
    onChange,
    inputError,
    createRepo,
    onInputError,
    onChangeNewRepo,
  } = props

  return (
    <Grid
      xs={12}
      container
      sx={styles.container}
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
      <Grid 
        xs={3}
        md={1}
        sx={styles.sync}
        className='gb-grid-sync-repos'
      >
        <SyncRepos />
      </Grid>

      {createRepo ? (
        <>
          <Grid
            xs={12}
            sx={styles.name}
            className='gb-grid-repo-name'
          >
            <RepoCreate
              newRepo={newRepo}
              inputError={inputError}
              onInputError={onInputError}
              onChangeNewRepo={onChangeNewRepo}
            />
          </Grid>
        </>
      ) : null}
    </Grid>
  )

}

