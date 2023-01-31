import type {} from '@mui/lab/themeAugmentation'
import type { dims } from '../theme/dims'
import type { gutter } from '../theme/gutter'
import type { colors } from '../theme/colors'

declare module '@mui/material/styles' {
  interface Theme {
    dims: typeof dims
    gutter: typeof gutter
    palette: {
      colors: typeof colors
    }
  }

  interface Palette {
    light: Palette['primary'];
  }

  interface PaletteOptions {
    light: PaletteOptions['primary'];
  }
}

export * from './action.types'
export * from './helpers.types'
export * from './panel.types'
export * from './sidebar.types'
export * from './tabs.types'
export * from './theme.types'
export * from './tree.types'
export * from './form.types'
export * from './events.types'