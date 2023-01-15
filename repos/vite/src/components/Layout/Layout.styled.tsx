import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiContainer from '@mui/material/Container'
import { colors } from '@gobletqa/components'

export const Container = styled(MuiContainer)`
  max-width: 100% !important;
`

export const RContainer = styled(MuiContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  max-width: 100% !important;
`

export const RTSection = styled(Box)`
  width: 100%;
  // flex-grow: 1;
  // flex-shrink: 0;
  // flex-basis: 35px;
  min-height: 35px;
  max-height: 35px;
  background-color: ${colors.gray04};
`
export const RMSection = styled(Box)`
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  background-color: green;
`
export const RBSection = styled(Box)`
  width: 100%;
  flex-grow: 1;
  background-color: blue;
`
