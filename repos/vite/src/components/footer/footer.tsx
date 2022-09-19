import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { AppFooter } from './Footer.styled'

export const Footer = () => {
  return (
    <AppFooter component="footer" position="fixed" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppFooter>
  )
}
