
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { dims } from '@gobletqa/components/theme'

export const PageContainer = styled(Box)`
  z-index: 0;
  display: flex;
  position: relative;
  margin-left: ${dims.nav.closedWidth}px;
  max-width: calc( 100vw - ${dims.nav.closedWidth}px );

  margin-top: ${dims.header.hpx} !important;
  max-height: calc( 100vh - ${dims.header.hpx} ) !important;
`