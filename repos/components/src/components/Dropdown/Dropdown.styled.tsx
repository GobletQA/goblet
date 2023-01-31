import type { ComponentProps } from 'react'

import { colors, dims, gutter } from '@GBC/theme'
import { H5 } from '@GBC/components/Text'
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

  // border-bottom: 1px solid ${colors.green10};
  height: ${dims.dropdown.header.px};
  min-height: ${dims.dropdown.header.px};

  & .MuiAccordionSummary-content: {
    margin-top: 0px;
    margin-bottom: 0px;
  }

`)

export const HeaderText = styled(H5)`
  flex-grow: 1;
  display: flex;
  align-items: center;
  margin-left: ${gutter.margin.hpx};
  height: ${dims.dropdown.header.px};
  color: var(--goblet-editor-foreground);
`

export const Body = styled(AccordionDetails)``