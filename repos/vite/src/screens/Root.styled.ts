
import { dims } from '@theme'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

export const ScreenWrap = styled(Box)<BoxProps>({
  marginTop: dims.header.height,
  marginLeft: dims.nav.closedWidth,
})


