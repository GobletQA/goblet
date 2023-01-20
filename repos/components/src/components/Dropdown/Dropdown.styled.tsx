import type { ComponentProps } from 'react'

import { colors } from '@GBC/theme'
import { styled } from '@mui/material/styles'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'

type THeaderProps = ComponentProps<typeof AccordionSummary> & {
  noIconTransform?: boolean
}

export const Container = styled(Accordion)`
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
    
    & h5 {
      color: ${colors.gray10}
    }
    
  }
`


const noTransformStyle = `
  & .MuiAccordionSummary-expandIconWrapper {
    transform: rotate(0deg) !important;
  }
`

export const Header = styled(AccordionSummary, {
  shouldForwardProp: (prop) => prop !== `noIconTransform`,
})(({ noIconTransform }: THeaderProps) => `
  ${noIconTransform ? noTransformStyle : ''}
`)

export const Body = styled(AccordionDetails)``