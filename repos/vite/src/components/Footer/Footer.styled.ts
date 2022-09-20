import AppBar, { AppBarProps } from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import { dims } from '@theme'

export const AppFooter = styled(AppBar)<AppBarProps>({
  bottom: 0,
  top: 'auto',
  '& .MuiToolbar-root': {
    minHeight: dims.footer.height,
  }
}) as unknown as typeof AppBar