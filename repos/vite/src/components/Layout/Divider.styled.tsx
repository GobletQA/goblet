import { colors, dims } from '@theme'
import { styled } from '@mui/material/styles'
import { VerticalDivider, HorizontalDivider } from 'react-page-split'
const { divider } = dims.panel

const sharedStyle = `
  z-index: 1;
  opacity: 0;
  background: #000;
  box-sizing: border-box;
  background-clip: padding-box;
  -webkit-transition: opacity 200ms ease;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 1;
  }
`

export const HDivider = styled(HorizontalDivider)`
  ${sharedStyle}
  height: 100%;
  cursor: col-resize;
  max-width: ${divider.wpx};
  margin: 0 -${divider.hvrpx};
  border-left: ${divider.hvrpx} solid ${colors.royalPurple};
  border-right: ${divider.hvrpx} solid ${colors.royalPurple};
`

export const VDivider = styled(VerticalDivider)`
  ${sharedStyle}
  cursor: row-resize;
  max-height: ${divider.hpx};
  margin: -${divider.hvrpx} 0;
  border-top: ${divider.hvrpx} solid ${colors.royalPurple};
  border-bottom: ${divider.hvrpx} solid ${colors.royalPurple};
`

export const LayoutContainer = styled(`div`)`
  width: 100%;
`