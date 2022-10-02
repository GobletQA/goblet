import { Theme } from '@mui/material/styles'
import { CSSProperties } from 'react'

export const components = (muiTheme:Theme):Theme['components'] => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'unset'
        }
      }
    },
  }
}