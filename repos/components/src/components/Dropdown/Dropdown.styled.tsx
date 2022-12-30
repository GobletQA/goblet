

import { styled } from '@mui/material/styles'
import Accordion from '@mui/material/Accordion'
import { ExpandMoreIcon } from '@GBC/components/Icons'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'

export const Container = styled(Accordion)`
  margin-top: 0px !important;

  &::before {
    height: 0px;
    background-color: initial;
    transition: none;
  }

`

export const Header = styled(AccordionSummary)`
  padding: 0px;
`

export const Body = styled(AccordionDetails)`
  padding: 0px;
`