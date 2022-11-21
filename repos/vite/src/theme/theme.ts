import type { TThemeTypes, TPaletteOpts, TGobletTheme } from '@types'

import { palette } from './palette'
import { ThemeType } from '@constants'
import { typography } from './typography'
import { components } from './components'
import { createTheme as createThemeMui } from '@mui/material/styles'

const muiTheme = createThemeMui()
let __GobletTheme:TGobletTheme

export const createTheme = (type:TThemeTypes=ThemeType) => {
  const builtPalette = palette[type](muiTheme)

  __GobletTheme = createThemeMui({
    palette: builtPalette,
    typography: typography(muiTheme, builtPalette),
    components: components(muiTheme, builtPalette)
  }) as TGobletTheme

  return __GobletTheme
}


export const getTheme = (type:TThemeTypes=ThemeType) => {
  const mode =__GobletTheme && __GobletTheme?.palette?.mode

  return __GobletTheme && (!mode || !type || mode === type)
    ? __GobletTheme
    : createTheme(type)
}
