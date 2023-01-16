import type { TGobletTheme } from '@GBC/types'

import Box from '@mui/material/Box'
import { getColor } from '@GBC/utils'
import { dims, colors } from '@GBC/theme'

import { styled } from '@mui/material/styles'


export const ActionBarContainer = styled(Box)(({ theme }) => `
  width 100%;
  display: flex;
  // Subtract 1 because of the border
  height: ${dims.browser.actions.height - 1}px;
  background-color: ${getColor(colors.gray03, colors.black11, theme)};
  border-bottom: 1px solid ${getColor(colors.gray04, colors.black12, theme)};
`)
