import { dims } from '@theme'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'

export const AppHeader = styled(AppBar)({
  padding: `0 20px`,
  '& .MuiToolbar-root': {
    minHeight: dims.header.height,
  }
})