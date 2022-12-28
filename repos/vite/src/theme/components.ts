import type { Theme } from '@mui/material/styles'
import type { TGobletTheme, TPaletteOpts } from '@types'
import { getColor } from '@utils/theme/getColor'

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
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            cursor: `not-allowed`,
          }
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
          backgroundColor: getColor(palette.colors.white, palette.colors.black12, { palette } as TGobletTheme)
        }
      }
    },
  }
}