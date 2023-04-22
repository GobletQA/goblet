import Box from '@mui/material/Box'
import { getColor } from '@GBC/utils'
import { styled } from '@mui/material/styles'
import { gutter, dims, colors } from '@GBC/theme'

export const ActionBarContainer = styled(Box)(({ theme }) => `
  width 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: ${gutter.padding.hpx};
  padding-right: ${gutter.padding.hpx};
  height: ${dims.browser.actions.height}px;
  background-color: ${getColor(colors.white, colors.black11, theme)};
  border-bottom: 1px solid ${getColor(colors.gray00, colors.black12, theme)};
`)

export const ActionContainer = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
`)

export const ActionGroupContainer = styled(Box)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
`)