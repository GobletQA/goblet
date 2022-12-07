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
          backgroundColor: getColor(palette.colors.white00, palette.colors.black02, { palette } as TGobletTheme)
        }
      }
    },
  }
}