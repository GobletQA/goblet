import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { getColor, colors, dims } from '@gobletqa/components'
import MuiContainer from '@mui/material/Container'

export const LayoutContainer = styled(Box)`
  width: 100%;

  & .react-page-split__panel {
    overflow: hidden;
  }
`

export const LContainer = styled(MuiContainer)`
  position: relative;
  max-width: 100% !important;
`

export const LAutomationCover = styled(Box)`
  top: 0px;
  left:0px;
  right:0px;
  opacity: 0;
  width: 100%;
  height: 0%;
  position: absolute;
  background-color: ${colors.black03};
  transition: height ${dims.trans.avgEase}, background-color ${dims.trans.avgEase}, opacity ${dims.trans.avgEase};

  &.active {
    cursor: wait;
    height: 100%;
    z-index: 100;
    opacity: 0.1;
  }
  
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
