
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { dims } from '@gobletqa/components/theme'

export const ScreenContainer = styled(Box)`
  z-index: 0;
  display: flex;
  position: relative;
  margin-left: ${dims.nav.closedWidth}px;
  max-width: calc( 100vw - ${dims.nav.closedWidth}px );

  // min-height: 100%;
  // margin-top: ${dims.header.hpx};
  // min-height: calc( 100vh - ${dims.header.hpx} );
`
