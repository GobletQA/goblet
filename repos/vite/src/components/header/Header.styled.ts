import { dims, gutter } from '@theme'
import MuiMenu from '@mui/material/Menu'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'


export const AppHeader = styled(AppBar)(({ theme }) => {
  return {
    padding: `0 ${gutter.padding.px}`,
    '& .MuiToolbar-root': {
      minHeight: dims.header.height,
    }
  }
})

export const Menu  = styled(MuiMenu)(({ theme }) => {
  return {
    '& .MuiPaper-root': {
      minWidth: 200,
    }
  }
})