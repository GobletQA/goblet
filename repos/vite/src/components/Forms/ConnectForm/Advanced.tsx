import type { TBuiltRepo } from '@types'
import type { TInputError } from './ConnectForm'
import type { TOnAutoChange } from '@gobletqa/components'

import { BranchFrom } from './BranchFrom'
import { emptyArr } from '@keg-hub/jsutils'
import { BranchSelect } from './BranchSelect'
import { colors } from '@gobletqa/components'
import { BranchToggle } from './BranchToggle'
import Grid from '@mui/material/Unstable_Grid2'
import { Container, Dropdown } from './Connect.styled'


export type TAdvanced = {
  branch?: string
  newBranch?:string
  repo?: TBuiltRepo
  disabled?:boolean
  branchFrom?:boolean
  inputError:TInputError
  onChange: TOnAutoChange
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

export const Advanced = (props:TAdvanced) => {

  const {
    repo,
    branch,
    disabled,
    onChange,
    newBranch,
    inputError,
    branchFrom,
    onInputError,
    onChangeNewBranch,
    onChangeBranchFrom,
  } = props
  

  return (
    <Container className='gb-advanced-connect-container' >
      <Dropdown
        disabled={disabled}
        initialExpand={false}
        headerText={`Advanced`}
        headerSx={styles.header}
        expandIconSx={styles.expand}
        id='gb-connect-advanced-form'
        className='gb-advanced-connect-dropdown'
      >
        <Grid
          rowSpacing={2}
          sx={styles.grid}
          container={true}
          columnSpacing={1}
          disableEqualOverflow={true}
          className='gb-grid-select-branch'
        >
        
          <Grid className='gb-grid-repo-select' xs={12} >
            <BranchToggle
              branchFrom={branchFrom}
              setBranchFrom={onChangeBranchFrom}
            />
          </Grid>
          {branchFrom ? (
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
          ) : (
            <Grid className='gb-grid-repo-select' xs={12} >
              <BranchSelect
                branch={branch}
                disabled={disabled}
                onChange={onChange}
                error={inputError.branch}
                branches={repo?.branches || emptyArr}
              />
            </Grid>
          )}
        </Grid>
      </Dropdown>
    </Container>
  )

}