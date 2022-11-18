import { Theme, PaletteOptions } from '@mui/material/styles'
import { CSSProperties } from 'react'

export const components = (
  muiTheme:Theme,
  palette:PaletteOptions
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
          // color: "red",
          backgroundColor: (palette?.primary as Record<string, string>)?.main,
        }
      }
    }
  }
}