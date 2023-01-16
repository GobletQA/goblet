import { styled } from '@mui/material/styles'
import { colors, dims } from '@gobletqa/components/theme'
import { VerticalDivider, HorizontalDivider } from 'react-page-split'
const { divider } = dims.panel

const sharedStyle = `
  z-index: 1;
  opacity: 0;
  background: #000;
  box-sizing: border-box;
  background-clip: padding-box;
  -webkit-transition: opacity 200ms ease-in-out;
  transition: opacity 200ms ease-in-out;

  &:hover {
    opacity: 1;
  }
`

export const HDivider = styled(HorizontalDivider)`
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

export const VDivider = styled(VerticalDivider)`
  ${sharedStyle}
  cursor: row-resize;
  max-height: ${divider.hpx};
  margin: -${divider.hvrpx} 0;
  border-top: ${divider.hvrpx} solid ${colors.royalPurple};
  border-bottom: ${divider.hvrpx} solid ${colors.royalPurple};
`