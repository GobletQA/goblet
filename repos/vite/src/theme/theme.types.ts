import { PaletteOptions } from '@mui/material'

export type TThemeTypes = 'dark' | 'light'

export type TColors = Record<string, string>

export type TPalette = {
  dark: PaletteOptions
  light: PaletteOptions
}
