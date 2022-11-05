import type { TColors, TPalette } from './theme.types'
import { Theme } from '@mui/material/styles'

export const colors:TColors = {
  // ---- Light Theme Colors
  lightPrimary: `#00b8d4`,
  lightPaper: `#ffffff`,
  lightBackground: `#f0f0f0`,

  // ---- Monaco Theme Colors
  lightDragHandle: `#efefef`,
  lightDragHandleHover: `#528bff`,

  // ---- Dark Theme Colors
  darkPrimary: `#00b8d4`,
  darkPaper: `#242526`,
  darkBackground: `#303030`,

  // ---- Monaco Theme Colors
  darkDragHandle: `#282c34`,
  darkDragHandleHover: `#528bff`,

  // ---- Common Theme Colors
  error: `rgb(232, 51, 51)`,
  success: `rgb(76,175,80)`,

  // ---- Default Theme Colors
  white: `#FFFFFF`,
  navyBlue: `#252c37`,

  // ---- Provider Specific Colors
  // githubBackground: `#161b22`,
  githubBackground: `#333333`,
  
  monacoFocus: `#323842`,
  monacoBorder: `#272A32`,
  monacoBackground: `#282c34`,
  monacoForeground: `#323842`,
} 

const paletteCommon = {
  colors,
  error: {
    main: colors.error
  },
  success: {
    main: colors.success
  }
}

export const palette:TPalette = {
  dark: (muiTheme:Theme) => ({
    ...paletteCommon,
    mode: `dark`,
    background: {
      default: colors.darkBackground,
      paper: colors.darkPaper,
    },
    primary: {
      main: colors.darkPrimary
    },
  }),
  light: (muiTheme:Theme) => ({
    ...paletteCommon,
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