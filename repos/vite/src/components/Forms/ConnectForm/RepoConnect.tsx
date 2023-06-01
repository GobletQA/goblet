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
  disabled?:boolean
  createRepo:boolean
  onChange?:TOnAutoChange
  inputError:TRepoInputError
  onChangeNewRepo:TRepoValueCB
  onSyncRepos:(...args:any[]) => void
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
  sync: { paddingTop: `2px` },
  name: { paddingTop: `0px` },
  description: { paddingTop: `0px` },
  container: {
    alignItems: `center`,
  },
}

const gridProps = {
  xs: 12,
  container: true,
  sx: styles.container,
  columnSpacing: {xs: 0, md: 0.5},
  className: 'gb-grid-repo-select-container'
}

export const RepoConnect = (props:TRepoProps) => {
  const {
    repo,
    repos,
    newRepo,
    disabled,
    onChange,
    inputError,
    createRepo,
    onSyncRepos,
    onInputError,
    onChangeNewRepo,
  } = props

  return (
    <Grid {...gridProps} >
      <Grid
        xs={9}
        md={11}
        className='gb-grid-repo-select'
      >
        <RepoSelect
          repo={repo}
          repos={repos}
          disabled={disabled}
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
        <SyncRepos onClick={onSyncRepos} />
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

