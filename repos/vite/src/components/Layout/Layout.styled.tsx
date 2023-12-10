import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import MuiContainer from '@mui/material/Container'
import { colors, dims } from '@gobletqa/components'

export const LayoutContainer = styled(Box)`
  width: 100%;
  height: calc( 100vh - ${dims.header.hpx} );
`

export const LContainer = styled(MuiContainer)`
  position: relative;
  max-width: 100% !important;
`

export const RContainer = styled(MuiContainer)`
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  max-width: 100% !important;
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
    opacity: 0.05;
  }
  
`
