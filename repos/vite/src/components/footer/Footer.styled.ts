import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'

export const AppFooter = styled(AppBar)({
  bottom: 0,
  top: 'auto',
  '& .MuiToolbar-root': {
    minHeight: 20,
  }
})