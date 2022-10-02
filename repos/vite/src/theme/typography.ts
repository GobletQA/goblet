import { Theme } from '@mui/material/styles'

const fontCommon = {
  fontFamily: "'Inter', sans-serif",
}

export const typography = (muiTheme:Theme) => ({
  ...fontCommon,
  h1: {
    ...fontCommon,
    fontSize: '2.125rem',
    fontWeight: 700
  },
  h2: {
    ...fontCommon,
    fontSize: '1.5rem',
    fontWeight: 700
  },
  h3: {
    ...fontCommon,
    fontSize: '1.25rem',
    fontWeight: 600
  },
  h4: {
    ...fontCommon,
    fontSize: '1rem',
    fontWeight: 600
  },
  h5: {
    ...fontCommon,
    fontSize: '0.875rem',
    fontWeight: 500
  },
  h6: {
    ...fontCommon,
    fontSize: '0.75rem',
    fontWeight: 500
  },
  body1: {
    ...fontCommon,
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: '1.334em'
  },
  body2: {
    ...fontCommon,
    fontWeight: 400,
    lineHeight: '1.5em',
    letterSpacing: '0em',
  },
  subtitle1: {
    ...fontCommon,
    fontWeight: 500,
    fontSize: '0.875rem',
    color: muiTheme.palette.grey[500]
  },
  subtitle2: {
    ...fontCommon,
    fontWeight: 400,
    fontSize: '0.75rem',
    color: muiTheme.palette.grey[500]
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem',
    color: muiTheme.palette.grey[300],
  },
})