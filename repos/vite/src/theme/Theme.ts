import type { TThemeTypes } from './theme.types'

import { typography } from './typography'
import { palette } from './palette'
import { createTheme as createThemeMui } from '@mui/material/styles'

export const createTheme = (type: TThemeTypes) => {
  return createThemeMui({
    typography,
    palette: palette[type],
  })
}
