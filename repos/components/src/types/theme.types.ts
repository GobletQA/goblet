import { Theme, Palette, PaletteOptions } from '@mui/material/styles'
import type { dims } from '../theme/dims'
import type { gutter } from '../theme/gutter'
import type { colors } from '../theme/colors'


export type TExtPalette = {
  colors: typeof colors
}

export type TPaletteOpts = PaletteOptions & TExtPalette

export enum EThemeMode {
  dark = 'dark',
  light = 'light'
}

export enum EGobletThemeName {
  dark = `Goblet-dark`,
  light = `Goblet-light`,
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
  type:EThemeMode
  setType: (type:EThemeMode) => any
}

export type TThemeChildren = {
  children: any
}

export type TThemeProvider = TThemeType & TThemeChildren

export type TEditorTheme = {
  base: string
  inherit: boolean;
  encodedTokensColors?: string[]
  colors: Record<string, string>
  rules: Record<string, string|boolean|number|undefined|null>[]
}

export type TStyle = Record<string, string|number>
export type TStyles = Record<string, TStyle>