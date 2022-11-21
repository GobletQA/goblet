import type { TThemeTypes, TPaletteOpts, TGobletTheme } from '@types'

import { palette } from './palette'
import { typography } from './typography'
import { components } from './components'
import { createTheme as createThemeMui } from '@mui/material/styles'

let __GobletTheme:TGobletTheme
const muiTheme = createThemeMui()

export const createTheme = (type: TThemeTypes) => {
  const builtPalette = palette[type](muiTheme)

  __GobletTheme = createThemeMui({
    palette: builtPalette,
    typography: typography(muiTheme),
    components: components(muiTheme, builtPalette)
  }) as TGobletTheme

  return __GobletTheme
}

export {
  __GobletTheme as GobletTheme
}