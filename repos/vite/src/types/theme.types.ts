import { Theme, PaletteOptions } from '@mui/material/styles'

import type { colors } from '@theme'

export type TPaletteOpts = PaletteOptions & {
  colors: typeof colors
}

export type TThemeTypes = 'dark' | 'light'

export type TColors = Record<string, string>

export type TPalette = {
  dark: (theme:Theme) => TPaletteOpts
  light: (theme:Theme) => TPaletteOpts
}
