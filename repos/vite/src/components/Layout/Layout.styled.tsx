import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { colors, dims } from '@gobletqa/components'
import MuiContainer from '@mui/material/Container'

export const LayoutContainer = styled(Box)`
  width: 100%;
`

export const LContainer = styled(MuiContainer)`
  max-width: 100% !important;
`

export const RContainer = styled(MuiContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  max-width: 100% !important;

  & .react-page-split.react-page-split--vertical {
    & .react-page-split__panel:first-of-type {
      overflow: hidden;
      min-height: ${dims.browser.actions.hpx};
    }

    & .react-page-split__panel:last-of-type {
      overflow: hidden;
    }
  }

`

export const RTSection = styled(Box)`
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  background-color: ${colors.gray04};
  flex-basis: ${dims.browser.actions.hpx};
  min-height: ${dims.browser.actions.hpx};
  max-height: ${dims.browser.actions.hpx};
`
