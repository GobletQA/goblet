import { Theme, Palette, PaletteOptions } from '@mui/material/styles'

import type { colors } from '@theme'

export type TExtPalette = {
  colors: typeof colors
}

export type TPaletteOpts = PaletteOptions & TExtPalette

export type TThemeTypes = 'dark' | 'light'

export type TColors = Record<string, string>

export type TPalette = {
  dark: (theme:Theme) => TPaletteOpts
  light: (theme:Theme) => TPaletteOpts
}

export type TGobletTheme = Omit<Theme, `palette`> & {
  palette: Palette & TExtPalette
}