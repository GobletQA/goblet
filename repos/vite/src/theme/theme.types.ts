import { PaletteOptions, Theme } from '@mui/material'

export type TThemeTypes = 'dark' | 'light'

export type TColors = Record<string, string>

export type TPalette = {
  dark: (theme:Theme) => PaletteOptions
  light: (theme:Theme) => PaletteOptions
}
