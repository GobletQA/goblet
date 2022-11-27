
import { dims } from '@theme'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

export const ScreenWrap = styled(Box)<BoxProps>({
  zIndex: 0,
  display: `flex`,
  position: `relative`,
  marginTop: dims.header.height,
  marginLeft: dims.nav.closedWidth,
  minHeight: `calc( 100vh - ${dims.header.hpx} )`,
  maxWidth: `calc( 100vw - ${dims.nav.closedWidth}px )`,
})


