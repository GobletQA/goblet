import type { TRepoInputError, TBuiltRepo } from '@types'
import type { TOnAutoChange } from '@gobletqa/components'

import { BranchFrom } from './BranchFrom'
import { emptyArr } from '@keg-hub/jsutils'
import { BranchSelect } from './BranchSelect'
import { CreateNewBranch } from '@constants'
import { colors } from '@gobletqa/components'
import Grid from '@mui/material/Unstable_Grid2'


export type TAdvanced = {
  branch?: string
  newBranch?:string
  repo?: TBuiltRepo
  disabled?:boolean
  branchFrom?:boolean
  onChange: TOnAutoChange
  inputError:TRepoInputError
  onChangeNewBranch?:(branch:string) => void
  onChangeBranchFrom?:(change:boolean) => void
  onInputError?:(key:string, value?:string) => void
}

const styles = {
  header: {
    opacity: `0.7`,
    color: colors.purple10,
    transition: `opacity 300ms ease`,
    [`:hover`]: {
      opacity: `1`,
    }
  },
  expand: {
    color: colors.purple10
  },
  grid: {
    alignItems: `center`
  }
}

export const BranchConnect = (props:TAdvanced) => {

  const {
    repo,
    branch,
    disabled,
    onChange,
    newBranch,
    inputError,
    branchFrom,
    onInputError,
    onChangeNewBranch
  } = props
  
  const selected = branchFrom ? CreateNewBranch : branch

  return (
    <Grid
      rowSpacing={2}
      sx={styles.grid}
      container={true}
      columnSpacing={1}
      disableEqualOverflow={true}
      className='gb-grid-select-branch'
    >

      <Grid className='gb-grid-repo-select' xs={12} >
        <BranchSelect
          branch={selected}
          disabled={disabled}
          onChange={onChange}
          branchFrom={branchFrom}
          error={inputError.branch}
          branches={repo?.branches || emptyArr}
        />
      </Grid>

      {branchFrom && (
        <Grid className='gb-grid-branch-from' xs={12} >
          <BranchFrom
            branch={branch}
            disabled={disabled}
            onChange={onChange}
            newBranch={newBranch}
            inputError={inputError}
            onInputError={onInputError}
            onChangeNewBranch={onChangeNewBranch}
            branches={repo?.branches || emptyArr}
          />
        </Grid>
      ) || null}
    </Grid>
  )

}