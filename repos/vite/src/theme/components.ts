import type { TPaletteOpts } from '@types'
import type { Theme } from '@mui/material/styles'
import { backdropClasses } from '@mui/material'


export const components = (
  muiTheme:Theme,
  palette:TPaletteOpts
):Theme[`components`] => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'unset'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: (palette?.primary as Record<string, string>)?.main,
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          
        },
        paper: {
          backgroundImage: `initial`,
          backgroundColor: palette.colors.black02
        }
      }
    },
  }
}