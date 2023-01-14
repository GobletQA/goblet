import type { TGobletTheme } from '@gobletqa/components'

import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { dims, colors } from '@gobletqa/components/theme'
import { useColor } from '@hooks/theme/useColor'

export const SubNavContainer = styled(Box)(({ theme }) => `
  width: 100%;
  position: absolute;
  top: ${dims.header.height}px;
  left: ${dims.nav.closedWidth}px;
  height: calc( 100% - ${dims.header.height}px );
  max-width: ${dims.nav.openWidth - dims.nav.closedWidth};
  background-color: ${useColor(`colors.white`, `colors.purple23`, theme as TGobletTheme)};
`)

export const SubNavContent = styled(Box)`
  height: 100%;
  display: flex;
`