import type { TGobletTheme } from '@GBC/types'
import type { ThemeOptions } from '@mui/material/styles'

import { dims } from './dims'
import { gutter } from './gutter'
import { palette } from './palette'
import { EThemeMode } from '../types'
import { components } from './components'
import { typography } from './typography'
import { createTheme as createThemeMui } from '@mui/material/styles'

const muiTheme = createThemeMui()
let __GobletTheme:TGobletTheme

export const createTheme = (type:EThemeMode) => {
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

export const getTheme = (type?:EThemeMode) => {
  const mode =__GobletTheme && __GobletTheme?.palette?.mode

  return __GobletTheme && (!mode || !type || mode === type)
    ? __GobletTheme
    : createTheme(type || EThemeMode.light)
}


const defaultTheme = {
  colors: {},
}

/**
 * Sets css var(--goblet-some-color-value) from the selected editor theme
 */
export const  setThemeVars = async (
  theme:Record<`colors`, Record<string, string>>=defaultTheme,
  context?:String
) => {

  // TODO: decide if context should be added to the prefix
  // Would allow separating the themes for monaco and race editors
  const prefix = '--goblet-'

  Object.keys(theme.colors).forEach(v => {
    document.documentElement.style.setProperty(
      `${prefix}${v.replace('.', '-')}`,
      theme.colors[v]
        || (defaultTheme.colors as Record<string, string> )[v] as string
        || 'rgba(0, 0, 0, 0)'
    )
  })

}
