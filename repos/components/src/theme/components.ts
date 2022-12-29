import type { TPaletteOpts } from '../types'
import type { Theme } from '@mui/material/styles'

import { EThemeType } from '../types'


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
          backgroundColor: palette.mode === EThemeType.light
            ? palette.colors.white
            : palette.colors.black12
        }
      }
    },
  }
}