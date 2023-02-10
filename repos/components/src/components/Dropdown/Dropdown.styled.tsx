import type { ComponentProps } from 'react'

import { colors, dims, gutter } from '@GBC/theme'
import { H5 } from '@GBC/components/Text'
import { styled } from '@mui/material/styles'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'

type THeaderProps = ComponentProps<typeof AccordionSummary> & {
  transformOn?:number
  transformOff?:number
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

const noProps = [
  `transformOn`,
  `transformOff`,
]

export const Header = styled(AccordionSummary, {
  shouldForwardProp: (prop) => !noProps.includes(prop as any),
})(({ transformOn=0, transformOff=-90 }: THeaderProps) => `

  height: ${dims.dropdown.header.px};
  min-height: ${dims.dropdown.header.px};

  & .MuiAccordionSummary-expandIconWrapper {
    transform: rotate(${transformOff}deg);
  }

  & .MuiAccordionSummary-expandIconWrapper.Mui-expanded {
    transform: rotate(${transformOn}deg);
  }

  & .MuiAccordionSummary-content: {
    margin-top: 0px;
    margin-bottom: 0px;
  }

`)

export const HeaderText = styled(H5)`
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-left: ${gutter.margin.hpx};
  height: ${dims.dropdown.header.px};
  color: var(--goblet-editor-foreground);
`

export const Body = styled(AccordionDetails)``