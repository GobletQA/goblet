import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Text,
  dims,
  colors,
  gutter,
  Button,
  getColor,
  IconButton,
  WarningIcon,
  AdsClickIcon
} from '@gobletqa/components'


export const DebuggerFrame = styled(`iframe`)``

export const DebuggerContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  background-color: ${getColor(colors.white, colors.black19, theme)};
`)

export const DebuggerHeaderContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${gutter.padding.hpx};
  background-color: ${getColor(colors.white, colors.black19, theme)};
`)

export const DebuggerHeaderActionContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  background-color: transparent;
`)

export const DebuggerHeaderAction = styled(Button)(({ theme }) => `
  
`)

export const DebuggerHeaderUrlContainer = styled(Box)``
export const DebuggerHeaderUrlText = styled(Text)``


export const DebuggerErrorContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${getColor(colors.white, colors.black19, theme)};
`)

export const DebuggerErrorContent = styled(Box)`
  
`
export const DebuggerErrorText = styled(Text)`
  
`

export const DebuggerErrorIcon = styled(WarningIcon)`
  
`

