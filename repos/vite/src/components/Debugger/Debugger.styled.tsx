import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  Text,
  colors,
  gutter,
  CloseIcon,
  IconButton,
  CachedIcon,
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
  right: 0px;
  width: 62px;
  height: 25px;
  position: absolute;
  background-color: ${colors.devtools.header};
`)

export const DebuggerHeaderActionContainer = styled(Box)(({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`)

export const DebuggerHeaderAction = styled(IconButton)(({ theme }) => `
  height: 25px;
  padding: 0px;
  font-size: 15px;
  color: ${colors.white};
  margin-left: ${gutter.margin.hpx};
`)

export const DebuggerReloadIcon = styled(CachedIcon)`
  font-size: inherit;
`

export const DebuggerCloseIcon = styled(CloseIcon)`
  font-size: inherit;
`



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
