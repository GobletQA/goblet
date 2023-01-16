import Box from '@mui/material/Box'
import { getColor } from '@GBC/utils'
import { dims, colors } from '@GBC/theme'

import { styled } from '@mui/material/styles'


  // Subtract 1 because of the border
export const ActionBarContainer = styled(Box)(({ theme }) => `
  width 100%;
  display: flex;
  justify-contents: center;
  height: ${dims.browser.actions.height}px;
  background-color: ${getColor(colors.gray00, colors.black11, theme)};
  border-bottom: 1px solid ${getColor(colors.gray02, colors.black12, theme)};
`)

export const ActionContainer = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-contents: center;
`)