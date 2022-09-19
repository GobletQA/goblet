import AppBar, { AppBarProps } from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'

export const AppFooter = styled(AppBar)<AppBarProps>({
  bottom: 0,
  top: 'auto',
  '& .MuiToolbar-root': {
    minHeight: 20,
  }
}) as unknown as typeof AppBar