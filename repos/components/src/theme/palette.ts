import type { Theme } from '@mui/material/styles'
import type { TPalette, TPaletteOpts } from '../types'

import { deepMerge } from '@keg-hub/jsutils'
import { colors } from '@gobletqa/components/theme'


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
    contrastText: colors.white,
  },
  info: {
    main: colors.shamrock,
  },
  light: {
    dark: colors.gray11,
    main: colors.gray09,
    light: colors.gray07,
    contrastText: colors.gray19,
  },
}

const lightPalette = (muiTheme:Theme) => {
  return deepMerge<TPaletteOpts>(commonPalette, {
    mode: `light`,
    secondary: {
      main: colors.black07,
      contrastText: colors.white,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
    text: {
      primary: colors.black19
    }
  })
}

const darkPalette = (muiTheme:Theme) => {
  return deepMerge<TPaletteOpts>(commonPalette, {
    mode: `dark`,
    secondary: {
      main: colors.black03,
      contrastText: colors.black19,
    },
    light: {
      main: colors.gray19,
    },
    background: {
      default: colors.black19,
      paper: colors.black19,
    },
    text: {
      primary: colors.white
    }
  })
}

export const palette:TPalette = {
  dark: darkPalette,
  light: lightPalette
}