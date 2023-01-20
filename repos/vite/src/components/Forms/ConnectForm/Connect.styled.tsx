import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Unstable_Grid2'
import { Dropdown as DropdownComp } from '@gobletqa/components'

export const Container = styled(Box)`
  margin-bottom: 0px;
`

export const Dropdown = styled(DropdownComp)`
  margin-top: 0px !important;
  
  & .MuiPaper-root {
    margin-top: 0px;
  }
  
  & .MuiButtonBase-root.MuiAccordionSummary-root {
    justify-content: start;
    flex-direction: row-reverse;
  }
`

export const SubGridParent = styled(Grid)`
  padding-left: 0px;
`

export const SubGrid = styled(Grid)`
  padding-top: 0px;
`
