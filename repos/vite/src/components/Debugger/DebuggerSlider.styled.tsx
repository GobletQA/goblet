import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  colors,
  getColor,
  Loading,
} from '@gobletqa/components'

export const DebuggerLoading = styled(Loading)(({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`)


export const DebuggerSliderContainer = styled(Box)(({ theme }) => `
  bottom: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
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
