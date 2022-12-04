import type { Theme } from '@mui/material/styles'
import type { TPalette, TPaletteOpts } from '@types'

import { colors } from './colors'
import { deepMerge } from '@keg-hub/jsutils'

// const gray = {
//   50: colors.gray00,
//   100:colors.gray01,
//   200:colors.gray02,
//   300:colors.gray03,
//   400:colors.gray04,
//   500:colors.gray05,
//   600:colors.gray06,
//   700:colors.gray07,
//   800:colors.gray08,
//   900:colors.gray09,
// }

const commonPalette:TPaletteOpts = {
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
    main: colors.shamrock,
    contrastText: colors.white00,
  },
  info: {
    main: colors.shamrock,
  }
}

const lightPalette = (muiTheme:Theme) => {
  return deepMerge<TPaletteOpts>(commonPalette, {
    mode: `light`,
    secondary: {
      main: colors.black06,
      contrastText: colors.white00,
    },
    background: {
      default: colors.white00,
      paper: colors.white00,
    },
    text: {
      primary: colors.black01
    }
  })
}

const darkPalette = (muiTheme:Theme) => {
  return deepMerge<TPaletteOpts>(commonPalette, {
    mode: `dark`,
    secondary: {
      main: colors.monacoGray,
      contrastText: colors.black01,
    },
    background: {
      default: colors.black01,
      paper: colors.black01,
    },
    text: {
      primary: colors.white00
    }
  })
}

export const palette:TPalette = {
  dark: darkPalette,
  light: lightPalette
}