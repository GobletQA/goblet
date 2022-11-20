import type { Theme } from '@mui/material/styles'
import type { TPalette } from '@types'

import { colors } from './colors'
import { deepMerge } from '@keg-hub/jsutils'

const commonPalette = {
  colors,
  error: {
    main: colors.error
  },
  success: {
    main: colors.success
  }
}

const lightPalette = (muiTheme:Theme) => {
  return deepMerge(commonPalette, {
    mode: `light`,
    background: {
      default: colors.lightBackground,
      paper: colors.lightPaper,
    },
    primary: {
      main: colors.lightPrimary
    },
  })
}

const darkPalette = (muiTheme:Theme) => {
  return deepMerge(commonPalette, {
    mode: `dark`,
    background: {
      default: colors.darkBackground,
      paper: colors.darkPaper,
    },
    primary: {
      main: colors.darkPrimary
    },
  })
}

export const palette:TPalette = {
  dark: darkPalette,
  light: lightPalette
}