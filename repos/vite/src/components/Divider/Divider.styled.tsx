import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { colors, dims } from '@gobletqa/components/theme'

const { divider } = dims.panel


const sharedStyle = `
  opacity: 0;
  z-index: 9;
  background: #000;
  box-sizing: border-box;
  background-clip: padding-box;
  -webkit-transition: opacity 200ms ease-in-out;
  transition: opacity 200ms ease-in-out;

  &:hover {
    opacity: 1;
  }
`

export const HDivider = styled(Box)`
  ${sharedStyle}
  height: 100%;
  cursor: col-resize;
  position: relative;
  left: -1.5px;
  max-width: ${divider.wpx};
  margin: 0 -${divider.hvrpx};
  border-left: ${divider.hvrpx} solid ${colors.royalPurple};
  border-right: ${divider.hvrpx} solid ${colors.royalPurple};
`

export const VDivider = styled(Box)`
  ${sharedStyle}
  cursor: row-resize;
  max-height: ${divider.hpx};
  margin: -${divider.hvrpx} 0;
  border-top: ${divider.hvrpx} solid ${colors.royalPurple};
  border-bottom: ${divider.hvrpx} solid ${colors.royalPurple};
`
