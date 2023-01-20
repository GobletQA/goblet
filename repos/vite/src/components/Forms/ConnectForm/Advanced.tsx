import type { TOnAutoChange, TBuiltRepo } from '@types'

import { useState } from 'react'
import { emptyArr } from '@keg-hub/jsutils'
import { BranchSelect } from './BranchSelect'
import { colors } from '@gobletqa/components'
import { BranchToggle } from './BranchToggle'
import Grid from '@mui/material/Unstable_Grid2'
import { Container, Dropdown } from './Connect.styled'

export type TAdvanced = {
  branch?: string
  repo?: TBuiltRepo
  onChange: TOnAutoChange
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
    onChange
  } = props
  
  const [branchFrom, setBranchFrom] = useState<boolean>(false)

  return (
    <Container className='gr-user-story-container' >
      <Dropdown
        initialExpand={false}
        headerText={`Advanced`}
        id='connect-advanced-form'
        className='gr-advanced-connect-dropdown'
        headerSx={styles.header}
        expandIconSx={styles.expand}
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
              setBranchFrom={setBranchFrom}
            />
          </Grid>
          <Grid className='gb-grid-repo-select' xs={12} >
            <BranchSelect
              branch={branch}
              onChange={onChange}
              branches={repo?.branches || emptyArr}
            />
          </Grid>
        </Grid>
      </Dropdown>
    </Container>
  )

}