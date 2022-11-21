import type { Theme } from '@mui/material/styles'
import type { TPalette } from '@types'

import { colors } from './colors'
import { deepMerge } from '@keg-hub/jsutils'

const commonPalette = {
  colors,
  primary: {
    main: colors.royalPurple,
  },
  error: {
    main: colors.cardinal,
  },
  warning: {
    main: colors.honeyYellow,
  },
  success: {
    main: colors.shinyShamrock,
    contrastText: colors.white00,
  },
  info: {
    main: colors.shinyShamrock,
  },
}

const lightPalette = (muiTheme:Theme) => {
  return deepMerge(commonPalette, {
    mode: `light`,
    secondary: {
      main: colors.black06,
      contrastText: colors.white00,
    },
    background: {
      default: colors.white00,
      paper: colors.white00,
    },
  })
}

const darkPalette = (muiTheme:Theme) => {
  return deepMerge(commonPalette, {
    mode: `dark`,
    secondary: {
      main: colors.monacoGray,
      contrastText: colors.black01,
    },
    background: {
      default: colors.black02,
      paper: colors.black02,
    },
  })
}

export const palette:TPalette = {
  dark: darkPalette,
  light: lightPalette
}