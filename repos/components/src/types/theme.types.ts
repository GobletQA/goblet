import { Theme, Palette, PaletteOptions } from '@mui/material/styles'
import type { dims } from '../theme/dims'
import type { gutter } from '../theme/gutter'
import type { colors } from '../theme/colors'


export type TExtPalette = {
  colors: typeof colors
}

export type TPaletteOpts = PaletteOptions & TExtPalette

export enum EThemeType {
  dark = 'dark',
  light = 'light'
}

export type TColors = Record<string, string>

export type TPalette = {
  dark: (theme:Theme) => TPaletteOpts
  light: (theme:Theme) => TPaletteOpts
}

export type TGobletTheme = Omit<Theme, `palette`> & {
  dims: typeof dims
  gutter: typeof gutter
  palette: Palette & TExtPalette
}

export type TThemeType = {
  type:EThemeType
  setType: (type:EThemeType) => any
}

export type TThemeChildren = {
  children: any
}

export type TThemeProvider = TThemeType & TThemeChildren