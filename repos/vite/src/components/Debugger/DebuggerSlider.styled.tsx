import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  gutter,
  colors,
  getColor,
} from '@gobletqa/components'


export const DebuggerSliderContainer = styled(Box)(({ theme }) => `
  bottom: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${getColor(colors.gray00, colors.black12, theme)}
`)

export const DebuggerBody = styled(Box)(({ theme }) => `
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${getColor(colors.gray02, colors.black10, theme)};
`)
