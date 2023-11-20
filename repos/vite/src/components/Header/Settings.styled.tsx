import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


import {
  gutter,
  colors,
  getColor
} from '@gobletqa/components'

export const SettingsContainer = styled(Box)(({ theme }) => `
  flex-grow: 0;
  padding-left: ${gutter.padding.px};
  border-left: 1px solid ${getColor(colors.gray00, colors.black12, theme)};
`)