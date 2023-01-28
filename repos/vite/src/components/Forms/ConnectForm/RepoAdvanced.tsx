import type { TOnAutoChange } from '@gobletqa/components'
import type { TRepoValueCB, TRepoInputError, TBuiltRepo, TBuiltRepos } from '@types'


import Grid from '@mui/material/Unstable_Grid2'
import { RepoDescription } from './RepoDescription'
import { RepoOwnerSelect } from './RepoOwnerSelect'

export type TRepoAdvanced = Partial<typeof repoProps> & {
  owner?:string
  branch?: string
  parents?:string[]
  description?:string
  inputError:TRepoInputError
  onChangeOwner?:TOnAutoChange
  onChangeDescription:TRepoValueCB
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

export const RepoAdvanced = (props:TRepoAdvanced) => {
  const {
    owner,
    parents,
    inputError,
    description,
    onChangeOwner,
    onChangeDescription,
  } = props

  return (
    <Grid
      xs={12}
      container
      sx={styles.container}
      className='gb-grid-repo-select'
    >
      <Grid
        xs={12}
        sx={styles.description}
        className='gb-grid-repo-description'
      >
        <RepoDescription
          description={description}
          onChangeDescription={onChangeDescription}
        />
      </Grid>
      <Grid
        xs={12}
        sx={styles.description}
        className='gb-grid-repo-description'
      >
        <RepoOwnerSelect
          owner={owner}
          parents={parents}
          error={inputError.owner}
          onChange={onChangeOwner}
        />
      </Grid>
    </Grid>
  )

}

