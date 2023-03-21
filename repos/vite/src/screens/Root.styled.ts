
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { dims } from '@gobletqa/components/theme'

export const ScreenWrap = styled(Box)`
  z-index: 0;
  display: flex;
  position: relative;
  margin-top: ${dims.header.hpx};
  margin-left: ${dims.nav.closedWidth}px;
  min-height: calc( 100vh - ${dims.header.hpx} );
  max-width: calc( 100vw - ${dims.nav.closedWidth}px );
`
