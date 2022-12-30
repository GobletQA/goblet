import type { TGobletTheme } from '../types'
import type { ThemeOptions } from '@mui/material/styles'

import { dims } from './dims'
import { gutter } from './gutter'
import { palette } from './palette'
import { EThemeType } from '../types'
import { components } from './components'
import { typography } from './typography'
import { createTheme as createThemeMui } from '@mui/material/styles'

const muiTheme = createThemeMui()
let __GobletTheme:TGobletTheme

export const createTheme = (type:EThemeType) => {
  const builtPalette = palette[type](muiTheme)
  __GobletTheme = createThemeMui({
    dims,
    gutter,
    palette: builtPalette,
    typography: typography(muiTheme, builtPalette),
    components: components(muiTheme, builtPalette)
  } as ThemeOptions) as TGobletTheme

  return __GobletTheme
}

export const getTheme = (type?:EThemeType) => {
  const mode =__GobletTheme && __GobletTheme?.palette?.mode

  return __GobletTheme && (!mode || !type || mode === type)
    ? __GobletTheme
    : createTheme(type || EThemeType.light)
}
