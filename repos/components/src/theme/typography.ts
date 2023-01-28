import { TPaletteOpts } from '../types'
import { Theme } from '@mui/material/styles'
import { EThemeMode } from '../types'

const fontCommon = {
  fontFamily: `Manrope, sans-serif`,
  fontWeightLight: 400,
  fontWeightRegular: 500,
}

export const typography = (
  muiTheme:Theme,
  palette:TPaletteOpts
) => {
  const isLightTheme = palette.mode === EThemeMode.light
  const textGray = isLightTheme ? palette.colors.gray15 : palette.colors.gray03

  return {
    ...fontCommon,
    h1: {
      fontSize: '2.125rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 500
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 500
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '1.334em'
    },
    body2: {
      fontWeight: 400,
      lineHeight: '1.5em',
      letterSpacing: '0em',
    },
    subtitle1: {
      fontWeight: 500,
      color: textGray,
      fontSize: '0.875rem',
    },
    subtitle2: {
      fontWeight: 400,
      color: textGray,
      fontSize: '0.75rem',
    },
    caption: {
      fontWeight: 400,
      color: textGray,
      fontSize: '0.75rem',
    },
  }
}