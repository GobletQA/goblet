import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
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