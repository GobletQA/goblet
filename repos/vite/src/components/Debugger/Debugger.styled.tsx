import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Text,
  colors,
  Button,
  getColor,
  WarningIcon,
} from '@gobletqa/components'


export const DebuggerFrame = styled(`iframe`)`
  border: none;
  
`

export const DebuggerContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  max-height: 100%;
`)

export const DebuggerHeaderContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`)

export const DebuggerHeaderActionContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-top: 1px solid ${getColor(colors.gray02, colors.black14, theme)}
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
`)

export const DebuggerErrorContent = styled(Box)`
  
`
export const DebuggerErrorText = styled(Text)`
  
`

export const DebuggerErrorIcon = styled(WarningIcon)`
  
`

