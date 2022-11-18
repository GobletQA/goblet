import type { TThemeTypes } from './theme.types'

import { palette } from './palette'
import { typography } from './typography'
import { components } from './components'
import { createTheme as createThemeMui } from '@mui/material/styles'

const muiTheme = createThemeMui()

export const createTheme = (type: TThemeTypes) => {
  const builtPalette = palette[type](muiTheme)
  
  return createThemeMui({
    palette: builtPalette,
    typography: typography(muiTheme),
    components: components(muiTheme, builtPalette)
  })
}
