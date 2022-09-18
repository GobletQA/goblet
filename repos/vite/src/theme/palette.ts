import type { TColors, TPalette } from './theme.types'
import { PaletteOptions } from '@mui/material'

export const colors:TColors = {
  // ---- Light Theme Colors
  lightPrimary: `#00b8d4`,
  lightPaper: `#ffffff`,
  lightBackground: `#f0f0f0`,

  // ---- Dark Theme Colors
  darkPrimary: `#00b8d4`,
  darkPaper: `#242526`,
  darkBackground: `#303030`,

  // ---- Common Theme Colors
  error: `rgb(232, 51, 51)`,
  success: `rgb(76,175,80)`,
} 

const paletteCommon = {
  error: {
    main: colors.error
  },
  success: {
    main: colors.success
  }
}

export const palette:TPalette = {
  dark: {
    ...paletteCommon,
    mode: `dark`,
    background: {
      default: colors.darkBackground,
      paper: colors.darkPaper,
    },
    primary: {
      main: colors.darkPrimary
    },
  },
  light: {
    ...paletteCommon,
    mode: `light`,
    background: {
      default: colors.lightBackground,
      paper: colors.lightPaper,
    },
    primary: {
      main: colors.lightPrimary
    },
  }
}