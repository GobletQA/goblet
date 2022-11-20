import { dims, gutter, } from '@theme'
import MuiMenu from '@mui/material/Menu'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import type { TPaletteOpts } from '@types'

export const AppHeader = styled(AppBar)(({ theme }) => {
  return {
    padding: `0 ${gutter.padding.px}`,
    // backgroundColor: theme.palette.common.white,
    backgroundColor: (theme?.palette as unknown as TPaletteOpts)?.colors.monacoForeground,
    
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